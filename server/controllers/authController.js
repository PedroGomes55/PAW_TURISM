var mongoose = require("mongoose");
mongoose.set("runValidators", true);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../jwt_Secret/config");

var User = require("../models/user");
var Heritage = require("../models/heritage");

var authController = {};

//rendering login page
authController.sendLogin = function (req, res) {
  res.render("authentication/login");
};
//form to login
authController.login = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  //Verifica user
  if (!user) {
    var error = ["The user doesn´t exist!"];
    return res.render("authentication/login", { error: error });
  }
  //check if the password is valid
  var passwdValid = bcrypt.compareSync(req.body.password, user.password);
  //verifica password
  if (!passwdValid) {
    var error = ["The password is incorret!"];
    return res.render("authentication/login", { error: error });
  }
  //cria token para user -> expires in 24 hours
  var userToken = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400,
  });
  res.cookie("token", userToken);
  let procura = Heritage.find();
  const found = await procura.exec();
  res.render("heritage/heritage", { heritage: found });
};

//rendering of signUp page
authController.sendSignUp = function (req, res) {
  res.render("authentication/signUP");
};
//form to create user signUp
authController.signUp = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let errorEmail = ["User email already exist!"];
    return res.render("authentication/signUP", { error: errorEmail });
  }
  if (req.body.password != req.body.password2) {
    var errorPW = ["Password's doesn't match"];
    return res.render("authentication/signUP", { error: errorPW });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const result = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      points: 0,
      roles: "User",
    });
    var userToken = jwt.sign({ id: result._id }, config.secret, {
      expiresIn: 86400,
    });
    res.cookie("token", userToken);
    console.log("userToken: " + userToken);
    res.redirect("../heritage");
  } catch (err) {
    console.log(err);
    var error = ["Error creating User!"];
    return res.render("authentication/signUP", { error: error });
  }
};

//Rendering of page to edit password
authController.sendForgetPW = function (req, res) {
  res.render("authentication/forgetPw");
};
//form to edit user password
authController.forgetPW = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    let error = ["User email dosen´t exist!"];
    return res.render("authentication/forgetPW", { error: error });
  }
  if (req.body.password != req.body.password2) {
    let errorPW = ["Password's doesn't match!"];
    console.log(errorPW);
    return res.render("authentication/forgetPW", { error: errorPW });
  }
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  let update = await User.findByIdAndUpdate(
    { _id: user._id },
    { password: hashedPassword }
  );
  if (!update) {
    let error = ["The user doesn´t exist!"];
    res.render("authentication/forgetPW", { error });
  }
  res.render("authentication/login");
};

//logout
authController.logout = function (req, res) {
  res.clearCookie("token").status(200);
  res.redirect("../");
  res.end();
};

//Verify if is a Employee
authController.verifyTokenEmployee = async function (req, res, next) {
  var tokenUser = req.cookies["token"];
  if (!tokenUser) {
    let errorExpired = ["Seasson expired!\nMake login again!"];
    res.render("authentication/login", { errorExpired });
  }
  try {
    // verifies secret and checks exp
    const decoded = jwt.verify(tokenUser, config.secret);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      let error = ["Error searching by your data!"];
      return res.render("authentication/login", { error });
    } else if (user.roles == "Employee") {
      return next();
    } else {
      res.render("error", {
        message: "You don´t have permissions to access this page!",
        error: { status: "", stack: "" },
      });
    }
  } catch (err) {
    res.render("error", {
      message: "Error - validate your session!",
      error: { status: "", stack: "" },
    });
  }
};

//Verify if token exist
authController.verifyToken = async function(req, res, next) {
  var tokenUser = req.cookies["token"];
  if (!tokenUser) {
    let errorExpired = ["Seasson expired!\nMake login again!"];
    res.render("authentication/login", { errorExpired });
  }
  try {
    const decoded = jwt.verify(tokenUser, config.secret);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      let error = ["Error searching by your data!"];
      return res.render("authentication/login", { error });
    } else {
      return next();
    }
  } catch (err) {
    let error = ["You don´t have permissions to access this!"];
    res.render("authentication/login", { error });
  }
}

//Get user logged
authController.getAuthenticatedUser = async function (req, res, next) {
  var tokenUser = req.cookies["token"];
  if (!tokenUser) {
    let errorExpired = ["Seasson expired!\nMake login again!"];
    res.render("authentication/login", { errorExpired });
    return;
  }
  try {
    const decoded = jwt.verify(tokenUser, config.secret);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      let error = ["Error searching by your data!"];
      return res.render("authentication/login", { error });
    }
    return user;
  } catch (err) {
    return res.render("error", {
      message: "Error - validate your session!",
      error: { status: "", stack: "" },
    });
  }
};

//API
authController.sendLoginAPI = function (req, res) {
  res.status(200).json({ message: "OK" });
};
authController.loginAPI = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  //Verifica user
  if (!user) {
    var error = ["The user doesn´t exist!"];
    return res.json({ auth: false, token: null, message: error });
  }
  //check if the password is valid
  var passwdValid = bcrypt.compareSync(req.body.password, user.password);
  //verifica password
  if (!passwdValid) {
    var error = ["The password is incorret!"];
    return res.json({ auth: false, token: null, message: error });
  }
  //cria token para user -> expires in 24 hours
  var userToken = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400,
  });
  let procura = Heritage.find();
  const found = await procura.exec();
  res.cookie("token", userToken);
  res.status(200).json({
    auth: true,
    token: userToken,
    message: "Login is valid",
    data: found,
  });
};

authController.sendSignUpAPI = function (req, res) {
  res.status(200).json({ message: "OK" });
};
authController.signUpAPI = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    let errorEmail = ["User email already exist!"];
    return res.json({ auth: false, token: null, message: errorEmail });
  }
  if (req.body.password != req.body.password2) {
    var errorPW = ["Password's doesn't match"];
    return res.json({ auth: false, token: null, message: errorPW });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    const result = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      points: 0,
      roles: "User",
    });
    var userToken = jwt.sign({ id: result._id }, config.secret, {
      expiresIn: 86400,
    });
    let procura = Heritage.find();
    const found = await procura.exec();
    res.cookie("token", userToken);
    res.status(200).json({
      auth: true,
      token: userToken,
      message: "Authentication is valid",
      data: found,
    });
  } catch (error) {
    console.error("Error creating User:", error);
    return res.json({ auth: false, token: null, message: error });
  }
};

authController.sendForgetPWAPI = function (req, res) {
  res.status(200).json({ message: "OK" });
};
authController.forgetPWAPI = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    let error = ["User email dosen´t exist!"];
    return res.json({ message: error });
  }
  if (req.body.password != req.body.password2) {
    let errorPW = ["Password's doesn't match!"];
    return res.json({ auth: false, token: null, message: errorPW });
  }
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  let update = await User.findByIdAndUpdate(
    { _id: user._id },
    { password: hashedPassword }
  );
  if (!update) {
    let error = ["The user doesn´t exist!"];
    return res.json({ auth: false, token: null, message: error });
  }
  res.status(200).json({ message: "Change Password valid" });
};

authController.logoutAPI = function (req, res) {
  res.clearCookie("token").status(200);
  //res.redirect("../");
  res.end();
};

authController.getAuthenticatedUserAPI = async function (req, res, next) {
  var tokenUser = req.headers["authorization"].substring("Bearer ".length);
  if (!tokenUser) {
    return res
      .status(404)
      .json({ error: "Session expired!\nPlease logIn again!" });
  }
  try {
    const decoded = jwt.verify(tokenUser, config.secret);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ error: "Error searching for user data!" });
    }
    return user;
  } catch (err) {
    return res.status(500).json({ error: "Error - validate your session!" });
  }
};

module.exports = authController;
