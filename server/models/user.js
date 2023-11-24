var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

var rolesUser = ["Employee", "User"];

var validateString = function (string) {
  return !(string.trim().length === 0);
};

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        var emailRegex = /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/;
        return emailRegex.test(value);
      },
      message: `Email is not valid`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: [validateString, "Can´t be blank"],
  },
  roles: {
    type: String,
    enum: rolesUser,
    default: "User",
    required: true,
  },
  points: {
    type: Number,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  promosList:[
    {
      promo: {
        type: ObjectId,
        ref: "Promo",
        required: false,
      },
    }
  ]
});

UserSchema.virtual("rolesUser").get(function () {
  return rolesUser;
});

module.exports = mongoose.model("User", UserSchema);