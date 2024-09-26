const db = require("../config/db");

// Get all products
const getOrders = async (req, res) => {
  const sql = "SELECT * FROM orders";
  
  try {
    console.log("get orders");
    const [rows] = await db.query(sql);
    return res.json(rows);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    return res.status(500).json({ message: "Error inside server", err });
  }
};


//add product
const addOrder = async (req, res) => {

  console.log("Request body:", req.body); // Log the request body

  const sql = `
  INSERT INTO orders (client_id, order_date, status, total_amount)
  VALUES (?, ?, ?, ?)
`;

const values = [
  req.body.client_id,
  req.body.order_date,
  req.body.status,
  req.body.total_amount,
];

  try {

    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "order added successfully.", result });
  } catch (err) {
    console.error("Error adding order:", err.message);
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


//update a product
const updateOrder = async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const value = req.params.order_id;
  const sql = `
      UPDATE orders 
      SET  order_date = ?, status = ?, total_amount = ?
      WHERE order_id = ?
    `;

    const orderId = req.params.order_id;
    // Values for the SQL query
    const values = [
      req.body.order_date,
      req.body.status,
      req.body.total_amount,
      orderId,
    ];

  try {
    const [result] = await db.query(sql, values);
    return res.status(200).json({ message: "Order updated successfully.", result });
  } catch (err) {
    console.error("Error updating Order:", err.message); // Log any error messages
    return res.status(500).json({ message: "Error inside server.", err });
  }
};


// // Delete a product
const deleteOrder = async (req, res) => {
  const sql = "DELETE FROM orders WHERE order_id = ?;";
  const value = req.params.order_id;

  try {
    console.log("delete order");
    const [result] = await db.query(sql, [value]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ Message: "Order not found" });
    }
    return res.json({ Message: "Order deleted successfully", result });
  } catch (err) {
    return res.status(500).json({ Message: "Error inside server", err });
  }
};

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder
};
