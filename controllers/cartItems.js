const db = require("../config/db");

// Get all item
const getCartItem = async (req, res) => {
  const {user_id} = req.body; // Assuming user_id is passed as a parameter in the request URL
console.log(user_id);
  try {
    // 1. Get cart_id from cart table using user_id
    const cartQuery = `SELECT cart_id FROM cart WHERE user_id = ?`;
    const [cartRows] = await db.query(cartQuery, [user_id]);

    if (cartRows.length === 0) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    const cart_id = cartRows[0].cart_id;

    // 2. Get cart items from cart_items table using cart_id
    const sql = "SELECT * FROM cart_items WHERE cart_id = ?";
    const [rows] = await db.query(sql, [cart_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No items found in the cart." });
    }

    return res.json(rows); // Return the cart items
  } catch (err) {
    console.error("Error fetching cart items:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};




//add item
const addCartItem = async (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  try {
    // 1. Check if a cart exists for the given user_id
    const cartQuery = `SELECT cart_id FROM cart WHERE user_id = ?`;
    const [cartRows] = await db.query(cartQuery, [user_id]);

    let cart_id;

    if (cartRows.length === 0) {
      // If no cart exists, insert a new cart record for this user and get the new cart_id
      const insertCartQuery = `INSERT INTO cart (user_id) VALUES (?)`;
      const [cartInsertResult] = await db.query(insertCartQuery, [user_id]);

      // Get the newly created cart_id
      cart_id = cartInsertResult.insertId;
      console.log(`New cart created with ID: ${cart_id}`);
    } else {
      // If a cart exists, get the cart_id
      cart_id = cartRows[0].cart_id;
    }

    // 2. Get the product details from the products table using product_id
    const productQuery = `
      SELECT product_id, name, description, price, image_url
      FROM products
      WHERE product_id = ?`;

    const [productRows] = await db.query(productQuery, [product_id]);

    if (productRows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    const { name, description, price, image_url } = productRows[0];

    // 3. Insert into cart_items table
    const insertQuery = `
      INSERT INTO cart_items (cart_id, product_id, quantity, item_name, description, price, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      cart_id,
      product_id,
      quantity,
      name,
      description,
      price,
      image_url,
    ];

    const [result] = await db.query(insertQuery, values);

    return res.status(200).json({ message: "Item added successfully.", result });
  } catch (err) {
    console.error("Error adding item:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};















// //add item
// const addCartItem = async (req, res) => {

//   console.log("Request body:", req.body); // Log the request body

//   const sql = `
//    INSERT INTO cart_items (cart_id, product_id, quantity, item_name, description, price,image_url)
//     VALUES (?, ?, ?, ?, ?, ?,?)
// `;

// const values = [
//     req.body.cart_id,
//     req.body.product_id,
//     req.body.quantity,
//     req.body.item_name,
//     req.body.description,
//     req.body.price,
//     req.body.image_url,
// ];

//   try {

//     const [result] = await db.query(sql, values);
//     return res.status(200).json({ message: "item added successfully.", result });
//   } catch (err) {
//     console.error("Error adding item:", err.message);
//     return res.status(500).json({ message: "Error inside server.", err });
//   }
// };

// Update a item
const updateCartItem = async (req, res) => {
    console.log("Request body:", req.body); // Log the request body
  
    const sql = `
       UPDATE cart_items
      SET product_id = ?, quantity = ?, item_name = ?, description = ?, price = ?,image_url =?
      WHERE cart_item_id = ?
    `;
  
    const cartItemId = req.params.cart_item_id; 
  
    const values = [
        req.body.product_id,
        req.body.quantity,
        req.body.item_name,
        req.body.description,
        req.body.price,
        req.body.image_url,
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
