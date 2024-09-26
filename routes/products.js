const express = require("express");
const { getProducts,getProductsByCategoryId,getProductsTwenty,getProductsByCategoryIdFive,addProduct,deleteProduct,updateProduct} = require("../controllers/products");

const router = express.Router();

router.get("/", getProducts);
router.get("/first", getProductsTwenty);
router.get("/:category_id", getProductsByCategoryId);
router.get("/:category_id", getProductsByCategoryIdFive);
router.post("/", addProduct);
router.delete("/:product_id",deleteProduct);
router.put("/:product_id",updateProduct)

module.exports = router;



