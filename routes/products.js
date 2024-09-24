const express = require("express");
const { getProducts,addProduct,deleteProduct,updateProduct} = require("../controllers/products");

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.delete("/:product_id",deleteProduct);
router.put("/:product_id",updateProduct)

module.exports = router;



