var express = require("express");
var router = express.Router();

var autheController = require("../controllers/authController");

router.get("/", autheController.sendLoginAPI);
router.post("/login", autheController.loginAPI);

router.get("/signUp", autheController.sendSignUpAPI);
router.post("/signUp", autheController.signUpAPI);

router.get("/forgetPW", autheController.sendForgetPWAPI);
router.post("/forgetPW", autheController.forgetPWAPI);

router.get("/logout", autheController.logoutAPI); 

module.exports = router;
