var mongoose = require("mongoose");

const { Events } = require("./events.js").schema;

var validateString = function (string) {
  return !(string.trim().length === 0);
};

var heritageType = [
  "Museu",
  "Parque de exposição",
  "Quinta",
  "Teatro",
  "Igreja",
  "Capela",
  "Aqueduto",
  "Castelo",
  "Palacio",
  "Farol",
  "Torre",
  "Estadio",
  "Ponte",
  "Zoo",
  "Oceanário",
  "Parque Natural",
];

var heritageSchema = new mongoose.Schema({
  heritageImg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  address: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  type: {
    type: String,
    required: true,
    enum: heritageType,
    validate: [validateString, "Can´t be blank"],
  },
  visitCounter: {
    type: Number,
    required: false,
  },
});

heritageSchema.virtual("heritageType").get(function () {
  return heritageType;
});

module.exports = mongoose.model("Heritage", heritageSchema);
