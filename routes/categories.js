const express = require("express");
const { getCategory,getCategorybyName, addCategory, updateCategory,deleteCategory } = require("../controllers/categories");

const router = express.Router();

router.get("/", getCategory);
router.get("/:name", getCategorybyName);
router.post("/", addCategory);
router.delete("/:category_id",deleteCategory);
router.put("/:category_id",updateCategory)

module.exports = router;



