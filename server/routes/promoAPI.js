var express = require("express");
var router = express.Router();

var promoController = require("../controllers/promoController");

router.get("/", promoController.showAllAPI);

router.post("/claim/:claimId", promoController.claimPromoAPI);

module.exports = router;