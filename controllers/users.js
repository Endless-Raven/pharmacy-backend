const db = require("../config/db");



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
  //c w j g g e g q b m q m q t c b
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
  verifyAndAddUser
};
