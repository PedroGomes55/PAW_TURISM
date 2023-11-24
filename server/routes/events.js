var express = require("express");
var router = express.Router();
const multer = require("multer");

var eventsController = require('../controllers/eventsController');
var authController = require('../controllers/authController');

const destination = 'public/images/uploads/events'
const filename = (req, file, cb) => cb(null, new Date().toISOString().replace(/:/g, '-') + '-'+ file.originalname)

const allowedImagesExts = ['jpg', 'png', 'gif', 'jpeg', 'jfif']
const fileFilter =  (req, file, cb) => 
  cb(null, allowedImagesExts.includes(file.originalname.split('.').pop()))

const storage = multer.diskStorage({ destination, filename })
const upload = multer({ storage, fileFilter })

router.get("/", authController.verifyTokenEmployee, eventsController.showAll);

router.get('/addEvent', authController.verifyTokenEmployee, eventsController.renderAddEvent);
router.post('/addEvent', authController.verifyTokenEmployee,upload.single("eventImg"), eventsController.addEvent);

router.get("/show/:id", authController.verifyTokenEmployee,eventsController.show);

router.get("/edit/:id", authController.verifyTokenEmployee,eventsController.renderEdit);
router.post("/edit/:id", authController.verifyTokenEmployee,upload.single('eventImg'), eventsController.sendEdit);

router.get("/delete/:id", authController.verifyTokenEmployee,eventsController.delete);


module.exports = router;