const express = require("express");
const { getCartItem, addCartItem, updateCartItem, deleteCartItem } = require("../controllers/cartItems");

const router = express.Router();

router.get("/", getCartItem);
router.post("/", addCartItem);
router.delete("/:cart_item_id",deleteCartItem);
router.put("/:cart_item_id",updateCartItem)

module.exports = router;

