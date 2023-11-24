var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

var shoppingCartSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      eventId: {
        type: ObjectId,
        ref: "Events",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  usagePromo: {
    type: Boolean,
    required: false,
    default: false,
  },
  namePromo: {
    type: String,
    required: false,
    default: "Sem Promo",
  },
  percentage: {
    type: Number,
    required: false,
    default: 0,
  },
  discount: {
    type: Number,
    required: false,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
