/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
// /* ***********************
//  * Require Statements
//  *************************/

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/");
const session = require("express-session");
const flash = require("connect-flash");
const pool = require('./database/');
const accountRoute = require("./routes/accountRoute.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Connect Flash middleware
app.use(flash());

// Express Messages Middleware
app.use(function(req, res, next) {
  res.locals.messages = req.flash(); // Store all flash messages
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser())

app.use(utilities.checkJWTToken)


/* ***********************
 * View engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// Trigger a 500 error route
// Error-handling middleware (in server.js)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err : {} // Only show stack trace in development
  });
});


// File Not Found Route - must be last route in list
app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    message: err.message || "Page not found",
    error: process.env.NODE_ENV === 'development' ? err : {} // Only show stack trace in development
  });
});

/* ***********************
* Express Error Handler
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  // Use the error message if it exists, otherwise set a default message
  let message = err.message || 'Oh no! There was a crash. Maybe try a different route?';
  
  // Render the error view
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});




/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

