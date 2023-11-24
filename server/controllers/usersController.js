var mongoose = require("mongoose");
mongoose.set("runValidators", true);

var User = require("../models/user");
var Promos = require("../models/promo");
var roles = require("../models/user").schema.path("roles").enumValues;
const authController = require("./authController");
const Purchases = require("../models/purchases");

var usersController = {};

//Show all users
usersController.showAll = async function (req, res) {
  let findAll = User.find();
  try {
    const users = await findAll.exec();
    res.render("user/users", { users: users });
  } catch (err) {
    res.render("error", { message: err.message, error: err });
  }
};


//Show users by id
usersController.show = async function (req, res) {
  let findPromos = Promos.find();
  try {
    let findUser = await User.findById({ _id: req.params.id });
    if (!findUser) {
      res.render("error", {
        message: "Not found user with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      const promos = await findPromos.exec();
      res.render("user/userDetail", { user: findUser, roles , promos});
    }
  } catch (err) {
    res.render("error", {
      message: "Not found user with id " + req.params.id, error: err });
  }
};

// render edit user by id
usersController.renderEdit = async function (req, res) {
  let id = req.params.id;
  try {
    let findUser = await User.findById({ _id: id });
    if (!findUser) {
      res.render("error", {
        message: "Not found user with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      res.render("user/userEdit", { user: findUser, roles });
    }
  } catch (err) {
    res.render("error", {
      message: "Not found user with id " + id,
      error: err,
    });
  }
};
//Edit user by id
usersController.sendEdit = async function (req, res) {
  let id = req.params.id;
  try {
    let findUser = await User.findById({ _id: id });
    if (!findUser) {
      res.render("error", {
        message: "Not found user with id " + id,
        error: { status: "", stack: "" },
      });
    } else {
      let updatedFields = {
        name: req.body.name,
        roles: req.body.roles,
        points: req.body.points,
        email: req.body.email,
      };
      let updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );
      res.redirect("/users/show/" + updatedUser._id);
    }
  } catch (err) {
    res.render("error", {
      message: "Error editing user with id " + id,
      error: err,
    });
  }
};

//Delete user by id
usersController.delete = async function (req, res) {
  try {
    const deletedUser = await User.findById(req.params.id);
    if (!deletedUser) {
      res.render("error", {
        message: "Error, couldn´t find and delete the User!",
        error: { status: "", stack: "" },
      });
    } else {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/users");
    }
  } catch (err) {
    res.render("error", {
      message: "Error, couldn´t delete the User!",
      error: { status: "", stack: "" },
    });
  }
};

usersController.profile = async function (req, res) {
  let findPromos = Promos.find();
  try {
    const findUser = await authController.getAuthenticatedUser(req, res);
    const purchases = await Purchases.find({ userId: findUser._id });
    const promos = await findPromos.exec();
    if (!findUser) {
      res.render("error", { message: "Not found user with id " + id, error: { status: "", stack: "" }});
    } else {

      res.render("user/profile", { user: findUser, roles , promos, purchases });
    }
  } catch (err) {
    res.render("error", { message: "Not found user with id " + req.params.id, error: err});
  }
};


//API
usersController.profileAPI = async function (req, res) {
  try {
    const findUser = await authController.getAuthenticatedUserAPI(req, res);
    const purchases = await Purchases.find({ userId: findUser._id });
    const promos = await Promos.find().exec();
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Success', data: findUser, promos, purchases });
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
};

usersController.renderEditAPI = async function (req, res) {
  let userId = req.params.id;
  try {
    let findUser = await User.findById( userId );
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'Success', data: findUser });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
};

usersController.sendEditAPI = async function (req, res) {
  let userId = req.params.id;
  try {
    let findUser = await User.findById( userId );
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      let updatedFields = {
        email: req.body.email,
        name: req.body.name,
      };
      let updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        updatedFields,
        { new: true }
      );
      res.status(200).json({ message: 'Success', data: updatedUser });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
};

usersController.deleteAccountAPI = async function (req, res) {
  const userId = req.params.id
  try {
    const deletedUser = await User.findById(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Success'});
    }
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong, please try again.' });
  }
};

module.exports = usersController;