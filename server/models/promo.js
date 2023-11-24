var mongoose = require("mongoose");

var validateString = function (string) {
    return !(string.trim().length === 0);
};

var promoSchema = new mongoose.Schema({
  namePromo: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  percentage: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Promo", promoSchema);
