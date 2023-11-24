var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var multer = require("multer");
var cors = require("cors");
var bodyParser = require("body-parser");

const mongoose = require("mongoose");
const mongooseURL =
  "mongodb+srv://admin:admin@pawgrupo19.8m3gfvn.mongodb.net/test";

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");

var indexRouter = require("./routes/index");
var authenticationRouter = require("./routes/auth");
var usersRouter = require("./routes/users");
var heritageRouter = require("./routes/heritage");
var eventsRouter = require("./routes/events");
var cartRouter = require("./routes/shoppingCart");
var promoRouter = require("./routes/promo");

//API
var heritageRouterAPI = require("./routes/heritageAPI");
var authenticationRouterAPI = require("./routes/authAPI");
var promoRouterAPI = require("./routes/promoAPI");
var cartRouterAPI = require("./routes/shoppingCartAPI");
var usersRouterAPI = require("./routes/usersAPI");

mongoose
  .connect(mongooseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to DB! - http://localhost:3000/"))
  .catch((err) => console.log(" error connecting to DB!:" + err));

var app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:4200",
    optionsSuccessStatus: 200,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/auth", authenticationRouter);
app.use("/users", usersRouter);
app.use("/heritage", heritageRouter);
app.use("/events", eventsRouter);
app.use("/shopping-cart", cartRouter);
app.use("/promos", promoRouter);

//API
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/v1/auth", authenticationRouterAPI);
app.use("/api/v1/users", usersRouterAPI);
app.use("/api/v1/heritage", heritageRouterAPI);
app.use("/api/v1/promos", promoRouterAPI);
app.use("/api/v1/shopping-cart", cartRouterAPI);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
