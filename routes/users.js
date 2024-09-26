const express = require("express");
const { getUsers, updateUser,resendVerification,sendPasswordResetCode,resetPassword,verifyCode, deleteUser,verifyAndAddUser ,sendVerification,signIn} = require("../controllers/users");

const router = express.Router();

router.get("/", getUsers);//get users
router.delete("/:user_id",deleteUser);//delete users
router.put("/",updateUser);//update users

//signUp
router.post("/email",sendVerification);//send email new user
router.post("/verifyemail",verifyAndAddUser);//verify code for new user
router.post("/ResendEmail",resendVerification);//resend if lost new user

//forgot password
router.post("/ForgotPwdemail",sendPasswordResetCode);//forgot email
router.post("/ChangePwd",resetPassword);//change password
router.post("/verifyPwd",verifyCode);//verify code for forget password

//signIn
router.post("/signin",signIn);

module.exports = router;



