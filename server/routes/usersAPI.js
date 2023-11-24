var express = require('express');
var router = express.Router();

var usersController = require('../controllers/usersController');

router.get('/profile', usersController.profileAPI);

router.get("/edit/:id", usersController.renderEditAPI);
router.post("/edit/:id",  usersController.sendEditAPI);

router.get("/delete/:id", usersController.deleteAccountAPI);

module.exports = router;