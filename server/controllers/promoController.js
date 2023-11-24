var mongoose = require("mongoose");
mongoose.set("runValidators", true);

var Promos = require("../models/promo");
const authController = require("./authController");

var promoController = {};

promoController.showAll = async function (req, res) {
  try {
    const promos = await Promos.find().exec();
    res.render("promos/promo", { promo: promos });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};

promoController.renderAddPromo = async function (req, res) {
  res.render("promos/addPromo", { promo: new Promos() });
};

promoController.addPromo = async function (req, res) {
  const listPromo = await Promos.find().exec();

  if (!req.body) {
    res.render("promos/addPromo", { error: ["Content can not be emtpy!"] });
  }
  const newPromo = new Promos({
    namePromo: req.body.namePromo,
    quantity: req.body.quantity,
    percentage: req.body.percentage,
    points: req.body.points,
  });
  try {
    const existingPromo = await Promos.findOne({
      namePromo: req.body.namePromo,
    });
    if (existingPromo) {
      res.render("promos/addPromo", {
        error: ["Promo name already exist!"],
        promo: newPromo,
        listPromo,
      });
    } else {
      await newPromo.save();
      res.redirect("/promos");
    }
  } catch (err) {
    res.render("promos/addPromo", { promo: newPromo, listPromo });
  }
};

promoController.delete = async function (req, res) {
  try {
    const promoId = req.params.promoId;
    const promo = await Promos.findById(promoId);
    if (!promo) {
      return res.render("error", {
        message: "Not found promo with id " + promoId,
        error: { status: "", stack: "" },
      });
    }
    await Promos.findByIdAndDelete(promoId);
    res.redirect("/promos");
  } catch (error) {
    res.render("error", {
      message: "Error deleting promo with id " + promoId,
      error: error,
    });
  }
};

promoController.renderEditPromo = async function (req, res) {
  const promoId = req.params.promoId;
  try {
    let findPromo = await Promos.findById({ _id: promoId });
    if (!findPromo) {
      res.render("error", {
        message: "Not found promo with id " + promoId,
        error: { status: "", stack: "" },
      });
    }
    res.render("promos/editPromo", { promo: findPromo });
  } catch (error) {
    res.render("error", {
      message: "Error found promo with id " + promoId,
      error: error,
    });
  }
};

promoController.sendEditPromo = async function (req, res) {
  const promoId = req.params.promoId;
  try {
    let findPromo = await Promos.findById({ _id: promoId });
    if (!findPromo) {
      res.render("error", {
        message: "Not found promo with id " + promoId,
        error: { status: "", stack: "" },
      });
    } else {
      let updatedFields = {
        namePromo: req.body.namePromo,
        quantity: req.body.quantity,
        percentage: req.body.percentage,
        points: req.body.points,
      };
      await Promos.findByIdAndUpdate({ _id: promoId }, updatedFields, {
        new: true,
      });
      res.redirect("/promos");
    }
  } catch (err) {
    console.error(err);
    res.render("error", {
      message: "Error editing promo with id " + promoId,
      error: err,
    });
  }
};

promoController.claimPromo = async function (req, res) {
  const claimId = req.params.claimId;
  const promos = await Promos.find().exec();
  try {
    const { quantity, namePromo, percentage } = req.body;
    const user = await authController.getAuthenticatedUser(req, res);
    if (!user) {
      return res.render("error", {
        message: "User does not exist",
        error: { status: "", stack: "" },
      });
    }
    if (user.promosList.some((p) => p.promo._id.toString() === claimId)) {
      error = ["Can not claim the same promo twice!"];
      return res.render("promos/promo", { error: error, promo: promos });
    } else {
      const promo = await Promos.findById(claimId);
      if (user.points >= promo.points) {
        user.promosList.push({ promo: promo });
        user.points -= promo.points;
        await user.save();
        if (promo.quantity == 0) {
          await Promos.findByIdAndDelete(claimId);
          await promo.save();
        } else if (promo.quantity == 1) {
          promo.quantity -= 1;
          await promo.save();
        } else {
          promo.quantity -= 1;
          await promo.save();
        }
        return res.redirect("/heritage");
      } else {
        error = ["You dont have points to claim promo!"];
        return res.render("promos/promo", { error: error, promo: promos });
      }
    }
  } catch (err) {
    return res.render("error", {
      message: "An error occurred while claim promo. Please try again later.",
      error: err,
    });
  }
};

//API
promoController.showAllAPI = async function (req, res) {
  let procura = Promos.find();
  try {
    const promo = await procura.exec();
    res.status(200).json({ message: "OK", data: promo });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again." });
  }
};

promoController.claimPromoAPI = async function (req, res) {
  const claimId = req.params.claimId;
  const promos = await Promos.find().exec();
  const { quantity, namePromo, percentage } = req.body;
  try {
    const user = await authController.getAuthenticatedUserAPI(req, res);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (user.promosList.some((p) => p.promo._id.toString() === claimId)) {
      return res.status(404).json({
        message: "Can not claim the same promo twice!",
        promo: promos,
      });
    }

    const promo = await Promos.findById(claimId);
    if (user.points >= promo.points) {
      user.promosList.push({ promo: promo });
      await user.save();

      if (promo.quantity === 0) {
        await Promos.findByIdAndDelete(claimId);
      } else {
        promo.quantity -= 1;
        await promo.save();
      }

      return res.status(200).json({ message: "Promo Claimed" });
    } else {
      return res.status(404).json({
        message: "You don't have enough points to claim the promo!",
        promo: promos,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred while claiming the promo. Please try again later.",
    });
  }
};

module.exports = promoController;
