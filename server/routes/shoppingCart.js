var express = require("express");
var router = express.Router();

var shoppingCartController = require("../controllers/shoppingCartController");
var authController = require('../controllers/authController');

router.get("/", authController.verifyToken, shoppingCartController.showCart);
router.post("/", authController.verifyToken, shoppingCartController.addToCart);

router.post("/:cartId", authController.verifyToken, shoppingCartController.removeFromCart);

router.post("/edit/:cartId", authController.verifyToken, shoppingCartController.editShoppingCart);

router.post("/addPromo/:cartId", authController.verifyToken, shoppingCartController.addPromoShoppingCart);

router.get("/payment", authController.verifyToken, shoppingCartController.renderPayment);
router.post("/payment/:cartId", authController.verifyToken, shoppingCartController.confirmPayment);

module.exports = router;
