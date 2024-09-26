const { decrypt } = require("dotenv");
const db = require("../config/db");
const bcrypt = require("bcrypt");


 const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.email",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    
    user: process.env.EMAIL,      // Your email address
    pass: process.env.EMAIL_PASS  // Your email password
  },
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    // from: process.env.EMAIL,
    from: process.env.EMAIL_PASS,
    to: email,
    subject: 'Verify your email',
    text: `Please use the following code to verify your email: ${verificationCode}`
  };
  await transporter.sendMail(mailOptions);
};

// Generate a verification code (e.g., 6 digits)
const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000);


let verificationCodes = {};  // Store codes in-memory (better to use a database in production)

// Send email verification before adding the user
const sendVerification = async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();
  
  const sql = `
    INSERT INTO temp_users (email, code) 
    VALUES (?, ?)
  `;
  
  console.log(email);
  
  try {
    // Store the email and code in temp_users table using parameterized query
    const [result] = await db.query(sql, [email, verificationCode]);

    // Send the verification email to the user
    await sendVerificationEmail(email, verificationCode);
    
    res.status(200).json({ message: "Verification email sent successfully.", result });

  } catch (err) {
    console.error("Error sending email:", err.message);
    res.status(500).json({ message: "Error sending verification email." });
  }
};


const resendVerification = async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();

  // SQL query to update the code for the existing email
  const updateSql = `
    UPDATE temp_users 
    SET code = ?, created_at = CURRENT_TIMESTAMP 
    WHERE email = ?
  `;

  try {
    // Update the verification code and timestamp for the email
    const [result] = await db.query(updateSql, [verificationCode, email]);

    // Check if any rows were affected (i.e., if the email exists in the table)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Email not found in temp_users." });
    }

    // Send the updated verification email to the user
    await sendVerificationEmail(email, verificationCode);
    
    res.status(200).json({ message: "Verification email resent successfully." });

  } catch (err) {
    console.error("Error resending email:", err.message);
    res.status(500).json({ message: "Error resending verification email." });
  }
};




const verifyAndAddUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  // Query the verification code for the email from the temp_users table
  const getCodeSql = `SELECT code FROM temp_users WHERE email = ?`;
  
  try {
    // Retrieve the stored verification code from temp_users table
    const [rows] = await db.query(getCodeSql, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email not found or not verified." });
    }

    const storedCode = rows[0].code;

    // Check if the provided verification code matches the stored code
    if (storedCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // If the verification code matches, proceed with adding the user to the users table
    const addUserSql = `
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at, phone_number) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.name,
      req.body.email,
      req.body.password_hash,
      req.body.role,
      req.body.created_at,
      req.body.updated_at,
      req.body.phone_number,
    ];

    // Add user to the users table
    const [result] = await db.query(addUserSql, values);

    // Optionally, delete the record from temp_users after successful verification and registration
    const deleteTempUserSql = `DELETE FROM temp_users WHERE email = ?`;
    await db.query(deleteTempUserSql, [email]);

    return res.status(200).json({ message: "User added successfully.", result });

  } catch (err) {
    console.error("Error processing request:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};



const sendPasswordResetCode = async (req, res) => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();

  // SQL query to check if the email exists in the users table
  const checkUserSql = `
    SELECT email FROM users WHERE email = ?
  `;

  // SQL query to insert or update the verification code in temp_users
  const updateSql = `
    UPDATE temp_users 
    SET code = ?, created_at = CURRENT_TIMESTAMP 
    WHERE email = ?
  `;

  const insertSql = `
    INSERT INTO temp_users (email, code) 
    VALUES (?, ?)
  `;

  try {
    // Check if the email exists in the users table
    const [userResult] = await db.query(checkUserSql, [email]);

    if (userResult.length === 0) {
      // If the email is not found, return an error
      return res.status(404).json({ message: "User not found with this email." });
    }

    // Check if email already exists in temp_users
    const [tempUserResult] = await db.query(`SELECT email FROM temp_users WHERE email = ?`, [email]);

    if (tempUserResult.length > 0) {
      // If the email exists in temp_users, update the code
      await db.query(updateSql, [verificationCode, email]);
    } else {
      // If the email does not exist in temp_users, insert a new record
      await db.query(insertSql, [email, verificationCode]);
    }

    // Send the verification email with the reset code to the user
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Password reset verification email sent successfully." });

  } catch (err) {
    console.error("Error sending password reset email:", err.message);
    res.status(500).json({ message: "Error sending password reset verification email." });
  }
};


const changePassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  // Query the verification code for the email from the temp_users table
  const getCodeSql = `SELECT code FROM temp_users WHERE email = ?`;

  try {
    // Retrieve the stored verification code from temp_users table
    const [rows] = await db.query(getCodeSql, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Email not found or not verified." });
    }

    const storedCode = rows[0].code;

    // Check if the provided verification code matches the stored code
    if (storedCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // If the verification code matches, proceed with updating the user's password
    const updatePasswordSql = `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE email = ?
    `;

    const passwordHash = await bcrypt.hash(newPassword,10); // Assuming you have a function to hash passwords

    // Update the user's password
    const [result] = await db.query(updatePasswordSql, [passwordHash, email]);

    // Optionally, delete the record from temp_users after successful password reset
    const deleteTempUserSql = `DELETE FROM temp_users WHERE email = ?`;
    await db.query(deleteTempUserSql, [email]);

    return res.status(200).json({ message: "Password changed successfully.", result });

  } catch (err) {
    console.error("Error processing request:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};












































// Get all products
const getUsers = async (req, res) => {
  const sql = "SELECT * FROM users";
  
  try {
    console.log("get users");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


// //add product
// const addUser = async (req, res) => {

//   console.log("Request body:", req.body); 

//   const sql = `
//   INSERT INTO users (name, email, password_hash, role, created_at, updated_at, phone_number)
//   VALUES ( ?,?,?, ?, ?, ?, ?)
// `;

// const values = [
//   req.body.name,
//   req.body.email,
//   req.body.password_hash,
//   req.body.role,
//   req.body.created_at,
//   req.body.updated_at,
//   req.body.phone_number,
// ];

//   try {


//     const [result] = await db.query(sql, values);
//     return res.status(200).json({ message: "user added successfully.", result });
//   } catch (err) {
//     console.error("Error adding user:", err.message);
//     return res.status(500).json({ message: "Error inside server.", err });
//   }
// };


//update a product
const updateUser = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const sql = `
      UPDATE users 
      SET name = ?, email = ?, password_hash = ?, role = ?, phone_number = ?, updated_at = ?
      WHERE user_id = ?
    `;

    // Values for the SQL query
    const values = [
        req.body.name,
        req.body.email,
        req.body.password_hash,
        req.body.role,
        req.body.created_at,
        req.body.updated_at,
        req.body.phone_number,
        req.body.user_id,
    ];

  try {
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "User updated successfully.", result });
  } catch (err) {
    console.error("Error updating User:", err.message); // Log any error messages
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// Delete a product
const deleteUser = async (req, res) => {
  const sql = "DELETE FROM users WHERE user_id = ?;";
  const value = req.params.user_id;

  try {
    console.log("delete user");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "user not found" });
    }
    return res.json({ Message: "user deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getUsers,
 // addUser,
  updateUser,
  deleteUser,
  sendVerification,
  verifyAndAddUser,
  resendVerification,
  sendPasswordResetCode,
  changePassword
};
