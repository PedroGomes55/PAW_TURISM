var express = require("express");
var router = express.Router();

var promoController = require("../controllers/promoController");
var authController = require('../controllers/authController');

router.get("/", authController.verifyToken, promoController.showAll);

router.get("/addPromo", authController.verifyTokenEmployee, promoController.renderAddPromo);
router.post('/addPromo', authController.verifyTokenEmployee, promoController.addPromo);

router.get("/delete/:promoId", authController.verifyTokenEmployee, promoController.delete);

router.get("/edit/:promoId", authController.verifyTokenEmployee, promoController.renderEditPromo);
router.post("/edit/:promoId", authController.verifyTokenEmployee, promoController.sendEditPromo);

router.post("/claim/:claimId", promoController.claimPromo);


module.exports = router;