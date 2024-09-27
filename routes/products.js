const express = require("express");
const { getProducts,getProductsById,getProductsByCategoryId,getProductsByCategoryName,getProductsTwenty,getProductsByCategoryIdFive,addProduct,deleteProduct,updateProduct} = require("../controllers/products");

const router = express.Router();

router.get("/", getProducts);//get all
router.get("/prodId/:product_id", getProductsById);//get by id
router.get("/category/name/:name", getProductsByCategoryName);//get by category name
router.get("/first", getProductsTwenty);//get 1st 20
router.get("/byId/:category_id", getProductsByCategoryId);//get by category id
router.get("/catId/:category_id", getProductsByCategoryIdFive);//get 5 category-wise

router.post("/", addProduct);
router.delete("/:product_id",deleteProduct);
router.put("/:product_id",updateProduct)

module.exports = router;



