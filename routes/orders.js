const express = require("express");
const { getOrders, addOrder, updateOrder, deleteOrder } = require("../controllers/order");

const router = express.Router();

router.get("/", getOrders);
router.post("/", addOrder);
router.delete("/:order_id",deleteOrder);
router.put("/:order_id",updateOrder)

module.exports = router;

