var mongoose = require("mongoose");
mongoose.set("runValidators", true);

const path = require("path");
const fs = require("fs");

var Events = require("../models/events");
var Heritage = require("../models/heritage");

var eventsController = {};

// Show all the heritages
eventsController.showAll = async function (req, res) {
  let procura = Events.find();
  try {
    const events = await procura.exec();
    res.render("events/events", { events: events });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

//render events add page
eventsController.renderAddEvent = async function (req, res) {
  let procuraheritage = Heritage.find();
  const heritage = await procuraheritage.exec();
  res.render("events/addEvent", { event: new Events(), heritage });
};
//add event
eventsController.addEvent = async function (req, res) {
  let procuraheritage = Heritage.find();
  const heritage = await procuraheritage.exec();

  if (!req.body) {
    res.render("error", {
      message: "Content can not be emtpy!",
      error: { status: "", stack: "" },
    });
  }
  const fileName = req.file != null ? req.file.filename : null;
  const event = new Events({
    heritageDestiny: req.body.heritageDestiny,
    eventImg: fileName,
    name: req.body.name,
    date: req.body.date,
    typeTicket: req.body.typeTicket,
    price: req.body.price,
    totalNumberTickets: req.body.totalNumberTickets,
  });
  try {
    if (event.eventImg == null) {
      event.imgError = "Just accept files jpg, png, gif.";
      throw err;
    }
    await event.save();
    res.redirect("/events");
  } catch (err) {
    console.log(err);
    res.render("events/addEvent", { event: event, heritage});
  }
};

//Show event by id
eventsController.show = async function (req, res) {
  let id = req.params.id;
  try {
    let findEvent= await Events.findOne({ _id: id });
    if (!findEvent) {
      res.render("error", {
        message: "Not found event with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      res.render("events/eventDetail", { event: findEvent });
    }
  } catch (err) {
    res.render("error", {
      message: "Not found event with id " + id,
      error: err,
    });
  }
};

// render edit event by id
eventsController.renderEdit = async function (req, res) {
  let procuraheritage = Heritage.find();
  const heritage = await procuraheritage.exec();
  let id = req.params.id;
  try {
    let findEvent = await Events.findById({ _id: id });
    if (!findEvent) {
      res.render("error", {
        message: "Not found event with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      res.render("events/eventEdit", { event: findEvent, heritage });
    }
  } catch (err) {
    res.render("error", {
      message: "Not found event with id " + id,
      error: err,
    });
  }
};
//Edit event by id
eventsController.sendEdit = async function (req, res) {
  let id = req.params.id;
  try {
    let findEvent = await Events.findById({ _id: id });
    if (!findEvent) {
      res.render("error", {
        message: "Not found event with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      let updatedFields = {
        name: req.body.name,
        date: req.body.date,
        price: req.body.price,
        totalNumberTickets: req.body.totalNumberTickets,
      };
      if (req.file) {
        const oldImagePath = path.join(__dirname, "..", "public", "images", "uploads", "events", findEvent.eventImg);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log(err);
          else console.log(`Deleted old image: ${oldImagePath}`);
        });
        updatedFields.eventImg = req.file.filename;
      }
      let updatedEvent = await Events.findByIdAndUpdate( { _id: id }, updatedFields, { new: true } );
      res.redirect("/events/show/" + updatedEvent._id);
    }
  } catch (err) {
    res.render("error", {
      message: "Error editing event with id " + id,
      error: err,
    });
  }
};

//delete heritage
eventsController.delete = async function(req, res) {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) {
      return res.render("error", {
        message: "Not found event with id " + req.params.id,
        error: { status: "", stack: "" },
      });
    }
    await Events.findByIdAndDelete(req.params.id);
    const imagePath = path.join("public", "images", "uploads", "events", event.eventImg);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    res.redirect("/events");
  } catch (error) {
    console.error(error);
    res.render("error", {
      message: "Error deleting event with id " + req.params.id,
      error: error,
    });
  }
};


module.exports = eventsController;
