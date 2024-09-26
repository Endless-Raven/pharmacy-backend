const db = require("../config/db");

// Get all cart
const getCart = async (req, res) => {
  const sql = "SELECT * FROM cart";
  
  try {
    console.log("get cart");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


//add cart
const addCart = async (req, res) => {

  console.log("Request body:", req.body); // Log the request body

  const sql = `
  INSERT INTO cart (user_id)
  VALUES (?)
`;

const values = [
  req.body.user_id,

];

  try {

    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "cart added successfully.", result });
  } catch (err) {
    console.error("Error adding order:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// Delete a product
const deleteCart = async (req, res) => {
  const sql = "DELETE FROM cart WHERE cart_id = ?;";
  const value = req.params.cart_id;

  try {
    console.log("delete Cart");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "cart not found" });
    }
    return res.json({ Message: "Cart deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getCart,
  addCart,
  deleteCart
};
