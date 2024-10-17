// Needed Resources 
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities/");
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

// Route to build my account
router.get("/login", Util.handleErrors(accountController.buildLogin));

router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to trigger a 500 error
router.get("/500error", (req, res, next) => {
    next({ status: 500, message: 'This is an intentional error' });
});


router.get("/", Util.checkLogin , Util.handleErrors(accountController.buildManagement));

router.post('/submit', function(req, res) {
    req.flash('notice', 'Your data was submitted successfully!');
    req.flash('error', 'There was an error processing your data.');
    res.redirect('/');
  });

// // Process the registration data
// router.post("/register", function(req, res) {
//     // regValidate.registationRules(),
//     // regValidate.checkRegData(),
//     // Util.handleErrors(req, res, accountController.registerAccount)
// })

// // Process the login attempt
// router.post("/login", function(req, res){
//     regValidate.loginRules(),
//     regValidate.checkLoginData(),
//     Util.handleErrors(accountController.accountLogin)
// })

// Process the registration data
router.post(
  "/register-new",
  regValidate.registationRules(),
  regValidate.checkRegData,
  Util.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login-new",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  Util.handleErrors(accountController.accountLogin)
)

module.exports = router;