const express = require("express");
const bodyParser = require("body-parser");
const nodemon = require("nodemon");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = require("./routes");
const session = require("express-session");
const mongodbSession = require("connect-mongodb-session")(session);
require('dotenv').config();  // Add this line to load environment variables

// Setup
const app = express();
app.set('view engine', 'ejs');
const path = require("path");
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.urlencoded({ extended: true }));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

// MongoDB connection
const mongoURI = `mongodb://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}?authSource=admin&retryWrites=true&w=majority`;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("db connected....");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

const store = new mongodbSession({
  uri: mongoURI,
  collection: 'sessions'
});

app.use(session({
  secret: 'this is secret project',
  resave: false,
  saveUninitialized: false,
  store: store
}));

// Middlewares
app.use(function user(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// Use routes
app.use('/', router);

// Start server
app.listen(4000, () => {
  console.log('port running on 4000...');
});
