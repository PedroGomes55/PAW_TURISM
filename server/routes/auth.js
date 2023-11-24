var express = require("express");
var router = express.Router();

var autheController = require("../controllers/authController");

router.get("/", autheController.sendLogin);
router.post("/login", autheController.login);

router.get("/signUp", autheController.sendSignUp);
router.post("/signUp", autheController.signUp);

router.get("/forgetPW", autheController.sendForgetPW);
router.post("/forgetPW", autheController.forgetPW);

router.get("/logout", autheController.logout);

module.exports = router;
