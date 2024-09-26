const db = require("../config/db");

// Get all item
const getCartItem = async (req, res) => {
  const sql = "SELECT * FROM cart_items";
  
  try {
    console.log("get item");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching item:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


//add item
const addCartItem = async (req, res) => {

  console.log("Request body:", req.body); // Log the request body

  const sql = `
   INSERT INTO cart_items (cart_id, product_id, quantity, item_name, description, price)
    VALUES (?, ?, ?, ?, ?, ?)
`;

const values = [
    req.body.cart_id,
    req.body.product_id,
    req.body.quantity,
    req.body.item_name,
    req.body.description,
    req.body.price,
    // req.body.created_at,             
    // req.body.updated_at
];

  try {

    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "item added successfully.", result });
  } catch (err) {
    console.error("Error adding item:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};

// Update a item
const updateCartItem = async (req, res) => {
    console.log("Request body:", req.body); // Log the request body
  
    const sql = `
       UPDATE cart_items
      SET product_id = ?, quantity = ?, item_name = ?, description = ?, price = ?
      WHERE cart_item_id = ?
    `;
  
    const cartItemId = req.params.cart_item_id; 
  
    const values = [
        req.body.product_id,
        req.body.quantity,
        req.body.item_name,
        req.body.description,
        req.body.price,
        cartItemId, 
    ];
  
    try {
      const [result] = await db.query(sql, values); 
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "item not found." }); 
      }
      return res.status(200).json({ message: "item updated successfully.", result });
    } catch (err) {
      console.error("Error updating item:", err.message); // Log any error messages
      return res.status(500).json({ message: "Error inside server.", err });
    }
  };
  

// Delete a item
const deleteCartItem = async (req, res) => {
  const sql = "DELETE FROM cart_items WHERE cart_item_id = ?;";
  const value = req.params.cart_item_id;

  try {
    console.log("delete item");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "item not found" });
    }
    return res.json({ Message: "item deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getCartItem,
  addCartItem,
  updateCartItem,
  deleteCartItem
};
