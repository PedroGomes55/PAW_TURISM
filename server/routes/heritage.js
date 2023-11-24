var express = require("express");
var router = express.Router();
const multer = require("multer");
const path = require("path");

var heritageController = require('../controllers/heritageController');
var authController = require('../controllers/authController');

const destination = 'public/images/uploads/heritage'
const filename = (req, file, cb) => cb(null, new Date().toISOString().replace(/:/g, '-') + '-'+ file.originalname)

const allowedImagesExts = ['jpg', 'png', 'gif', 'jpeg', 'jfif']
const fileFilter =  (req, file, cb) => 
  cb(null, allowedImagesExts.includes(file.originalname.split('.').pop()))

const storage = multer.diskStorage({ destination, filename })
const upload = multer({ storage, fileFilter })

router.get("/", authController.verifyToken, heritageController.showAll);

router.get('/addHeritage',authController.verifyToken, authController.verifyTokenEmployee, heritageController.renderAddHeritage);
router.post('/addHeritage', authController.verifyTokenEmployee, upload.single("heritageImg"), heritageController.addHeritage);

router.get("/show/:id", authController.verifyToken, heritageController.show);

router.get("/edit/:id", authController.verifyTokenEmployee, heritageController.renderEdit);
router.post("/edit/:id", authController.verifyTokenEmployee, upload.single('heritageImg'), heritageController.sendEdit);

router.get("/delete/:id", authController.verifyTokenEmployee, heritageController.delete);

module.exports = router;