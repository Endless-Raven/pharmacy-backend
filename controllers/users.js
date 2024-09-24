const db = require("../config/db");

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


//add product
const addUser = async (req, res) => {

  console.log("Request body:", req.body); 

  const sql = `
  INSERT INTO users (name, email, password_hash, role, created_at, updated_at, phone_number)
  VALUES ( ?,?,?, ?, ?, ?, ?)
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

  try {
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "user added successfully.", result });
  } catch (err) {
    console.error("Error adding user:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


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
  addUser,
  updateUser,
  deleteUser
};
