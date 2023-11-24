var express = require('express');
var router = express.Router();

var usersController = require('../controllers/usersController');
var authController = require('../controllers/authController');

/* GET users listing. */
router.get('/', authController.verifyTokenEmployee, usersController.showAll);

router.get('/show/:id', authController.verifyTokenEmployee, usersController.show);

router.get("/edit/:id", authController.verifyTokenEmployee, usersController.renderEdit);
router.post("/edit/:id", authController.verifyTokenEmployee, usersController.sendEdit);

router.get("/delete/:id", authController.verifyTokenEmployee, usersController.delete);

router.get('/profile', authController.verifyToken, usersController.profile);

module.exports = router;
