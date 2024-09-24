const express = require("express");
const { getCategory, addCategory, updateCategory,deleteCategory } = require("../controllers/categories");

const router = express.Router();

router.get("/", getCategory);
router.post("/", addCategory);
router.delete("/:category_id",deleteCategory);
router.put("/",updateCategory)

module.exports = router;



