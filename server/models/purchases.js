var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

var purchasesSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      quantityItem: {
        type: Number,
        required: true,
        default: 1,
      },
      nameItem: {
        type: String,
        required: true,
      },
      typeItem: {
        type: String,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  winningPoints: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Purchases", purchasesSchema);
