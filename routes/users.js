const express = require("express");
const { getUsers, addUser, updateUser, deleteUser} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);
router.delete("/:user_id",deleteUser);
router.put("/",updateUser)

module.exports = router;



