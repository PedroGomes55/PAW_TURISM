var mongoose = require("mongoose");

var validateString = function (string) {
  return !(string.trim().length === 0);
};

var eventsSchema = new mongoose.Schema({
  heritageDestiny: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  eventImg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  date: {
    type: Date,
    required: true,
    default: null,
  },
  typeTicket: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  totalNumberTickets: {
    type: Number,
    required: true,
    default: 0,
  },
});


module.exports = mongoose.model("Events", eventsSchema);
