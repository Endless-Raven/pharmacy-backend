const express = require("express");
const { getUsers, addUser, updateUser, deleteUser,verifyAndAddUser ,sendVerification} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
//router.post("/", addUser);
router.delete("/:user_id",deleteUser);
router.put("/",updateUser);
router.post("/email",sendVerification);
router.post("/verifyemail",verifyAndAddUser)


module.exports = router;



