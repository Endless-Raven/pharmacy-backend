const db = require("../config/db");

// Get all products
const getProducts = async (req, res) => {
  const sql = "SELECT * FROM products";
  
  try {
    console.log("get products");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


//add product
const addProduct = async (req, res) => {

  console.log("Request body:", req.body); // Log the request body

  const sql = `
  INSERT INTO products (name, description, price, stock_quantity, category_id, rating, color)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  // nextId,
  req.body.name,
  req.body.description,
  req.body.price,
  req.body.stock_quantity,
  req.body.category_id,
  req.body.rating,
  req.body.color,
];

  try {
     // Step 1: Generate the next ID
    // const generateNextId = async () => {
    //   const query = "SELECT product_id FROM products";
    //   const [results] = await db.query(query);
      
    //   if (results.length === 0) {
    //     return "P0001";
    //   }

    //   const ids = results.map(product => parseInt(product.product_id.slice(1)));
    //   const maxId = Math.max(...ids);
    //   return `P${(maxId + 1).toString().padStart(4, "0")}`;
    // };

    // const nextId = await generateNextId();

    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Product added successfully.", result });
  } catch (err) {
    console.error("Error adding Product:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


//update a product
const updateProduct = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const sql = `
      UPDATE products 
      SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, rating = ?, color = ?
      WHERE product_id = ?
    `;

    // Values for the SQL query
    const values = [
      req.body.name,
      req.body.description,
      req.body.price,
      req.body.stock_quantity,
      req.body.category_id,
      req.body.rating,
      req.body.color,
      req.body.product_id,
    ];

  try {
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Product updated successfully.", result });
  } catch (err) {
    console.error("Error updating Product:", err.message); // Log any error messages
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// Delete a product
const deleteProduct = async (req, res) => {
  const sql = "DELETE FROM products WHERE product_id = ?;";
  const value = req.params.product_id;

  try {
    console.log("delete product");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Product not found" });
    }
    return res.json({ Message: "Product deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct
};
