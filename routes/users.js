const express = require("express");
const { getUsers, updateUser,resendVerification,sendPasswordResetCode,resetPassword,verifyCode, deleteUser,verifyAndAddUser ,sendVerification} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);
router.delete("/:user_id",deleteUser);
router.put("/",updateUser);
router.post("/email",sendVerification);
router.post("/verifyemail",verifyAndAddUser);
router.post("/ResendEmail",resendVerification);
router.post("/ForgotPwdemail",sendPasswordResetCode);
router.post("/ChangePwd",resetPassword);
router.post("/verifyPwd",verifyCode);

module.exports = router;



