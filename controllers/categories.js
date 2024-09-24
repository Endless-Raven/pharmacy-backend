const db = require("../config/db");

// Get all products
const getCategory = async (req, res) => {
  const sql = "SELECT * FROM categories";
  
  try {
    console.log("get category");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching category:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


// //add product
const addCategory = async (req, res) => {

  console.log("Request body:", req.body); 
  const sql = `
  INSERT INTO categories (name, description)
  VALUES (?, ?)
`;

const values = [
  req.body.name,
  req.body.description,
];

  try {    
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Category added successfully.", result });
  } catch (err) {
    console.error("Error adding Category:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


//update a product
const updateCategory = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const sql = `
      UPDATE products 
      SET name = ?, description = ?
      WHERE category_id = ?
    `;

    // Values for the SQL query
    const values = [
      req.body.name,
      req.body.description,
      req.body.category_id,
    ];

  try {
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Category updated successfully.", result });
  } catch (err) {
    console.error("Error updating Category:", err.message); // Log any error messages
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// // Delete a product
const deleteCategory= async (req, res) => {
  const sql = "DELETE FROM categories WHERE category_id = ?;";
  const value = req.params.category_id;

  try {
    console.log("delete Category");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Category not found" });
    }
    return res.json({ Message: "Category deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
};
