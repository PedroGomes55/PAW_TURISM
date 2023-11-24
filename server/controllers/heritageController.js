var mongoose = require("mongoose");
mongoose.set("runValidators", true);

const path = require("path");
const fs = require("fs");

var Heritage = require("../models/heritage");
var Events = require("../models/events");
var User = require("../models/user");

var heritageType = require("../models/heritage").schema.path("type").enumValues;

var heritageController = {};

// Show all the heritages
heritageController.showAll = async function (req, res) {
  let procura = Heritage.find();
  try {
    const heritage = await procura.exec();
    res.render("heritage/heritage", { heritage: heritage });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

//render heritages add page
heritageController.renderAddHeritage = function (req, res) {
  res.render("heritage/addHeritage", {
    heritage: new Heritage(),
    heritageType,
  });
};
//add heritage
heritageController.addHeritage = async function (req, res) {
  if (!req.body) {
    res.render("error", {
      message: "Content can not be emtpy!",
      error: { status: "", stack: "" },
    });
  }
  const fileName = req.file != null ? req.file.filename : null;
  const heritage = new Heritage({
    heritageImg: fileName,
    name: req.body.name,
    address: req.body.address,
    type: req.body.type,
    visitCounter: 0,
  });
  try {
    if (heritage.heritageImg == null) {
      heritage.imgError = "Just accept files jpg, png, gif.";
      throw err;
    }
    await heritage.save();
    //res.render("heritage/heritage", { heritage: newHeritage });
    res.redirect("/heritage");
  } catch (err) {
    console.log(err);
    res.render("heritage/addHeritage", { heritage: heritage, heritageType });
  }
};

//Show heritage by id
heritageController.show = async function (req, res) {
  let procura = Events.find();
  const events = await procura.exec();

  let id = req.params.id;
  try {
    let findheritage = await Heritage.findOne({ _id: id });
    if (!findheritage) {
      res.render("error", {
        message: "Not found heritage with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      res.render("heritage/heritageDetail", { heritage: findheritage, events });
    }
  } catch (err) {
    res.render("error", {
      message: "Not found heritage with id " + id,
      error: err,
    });
  }
};

// render edit heritage by id
heritageController.renderEdit = async function (req, res) {
  let id = req.params.id;
  try {
    let findHeritage = await Heritage.findById({ _id: id });
    if (!findHeritage) {
      res.render("error", {
        message: "Not found heritage with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      res.render("heritage/heritageEdit", {
        heritage: findHeritage,
        heritageType,
      });
    }
  } catch (err) {
    res.render("error", {
      message: "Not found heritage with id " + id,
      error: err,
    });
  }
};
//Edit heritage by id
heritageController.sendEdit = async function (req, res) {
  let id = req.params.id;
  try {
    let findHeritage = await Heritage.findById({ _id: id });
    if (!findHeritage) {
      res.render("error", {
        message: "Not found heritage with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      let updatedFields = {
        name: req.body.name,
        address: req.body.address,
        type: req.body.type,
      };
      if (req.file) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          "images",
          "uploads",
          "heritage",
          findHeritage.heritageImg
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log(err);
          else console.log(`Deleted old image: ${oldImagePath}`);
        });
        updatedFields.heritageImg = req.file.filename;
      }
      let updatedHeritage = await Heritage.findByIdAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );
      res.redirect("/heritage/show/" + updatedHeritage._id);
    }
  } catch (err) {
    res.render("error", {
      message: "Error editing heritage with id " + id,
      error: err,
    });
  }
};

//delete heritage
heritageController.delete = async function (req, res) {
  try {
    const heritage = await Heritage.findById(req.params.id);
    if (!heritage) {
      return res.render("error", {
        message: "Not found heritage with id " + req.params.id,
        error: { status: "", stack: "" },
      });
    }
    await Heritage.findByIdAndDelete(req.params.id);
    const imagePath = path.join(
      "public",
      "images",
      "uploads",
      "heritage",
      heritage.heritageImg
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    res.redirect("/heritage");
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Error deleting heritage with id " + req.params.id,
      error: error,
    });
  }
};


/* ------------------- API ------------------- */
heritageController.showAllApi = async function (req, res) {
  let procura = Heritage.find();
  try {
    const heritage = await procura.exec();
    res.status(200).json({ message: 'OK', data: heritage });
  } catch (err) {
    return res.json({ message: 'Something went wrong, please try again.' });
  }
};

heritageController.showAPI = async function (req, res) {
  let procuraEvents = Events.find();
  const events = await procuraEvents.exec();

  let id = req.params.id;
  try {
    let findheritage = await Heritage.findOne({ _id: id });
    if (!findheritage) {
      return res.json({ message: "Not found heritage with id " + id });
    } else {    
    res.status(200).json({ message: 'OK', data: findheritage, events });
  }
  } catch (err) {
    return res.json({ message: "Not found heritage with id " + id });
  }
};

module.exports = heritageController;
