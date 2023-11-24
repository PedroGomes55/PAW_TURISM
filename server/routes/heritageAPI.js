var express = require("express");
var router = express.Router();

var heritageController = require('../controllers/heritageController');

router.get("/", heritageController.showAllApi);
router.get("/show/:id", heritageController.showAPI);



module.exports = router;