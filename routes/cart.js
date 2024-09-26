const express = require("express");
const { getCart, addCart, deleteCart } = require("../controllers/cart");

const router = express.Router();

router.get("/", getCart);
router.post("/", addCart);
router.delete("/:cart_id",deleteCart);

module.exports = router;

