var express = require("express");
var router = express.Router();

var shoppingCartController = require("../controllers/shoppingCartController");

router.get("/", shoppingCartController.showCartAPI);
router.post("/", shoppingCartController.addToCartAPI);

router.post("/:cartId", shoppingCartController.removeFromCartAPI);

router.post("/edit/:cartId", shoppingCartController.editShoppingCartAPI);

router.post("/addPromo/:cartId", shoppingCartController.addPromoShoppingCartAPI);

router.get("/payment", shoppingCartController.renderPaymentAPI);
router.post("/payment/:cartId", shoppingCartController.confirmPaymentAPI);

module.exports = router;
