// Needed Resources 
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities/");
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation')

// Route to build my account
router.get("/login", Util.checkJWTToken, Util.handleErrors(accountController.buildLogin));

router.get("/register", Util.handleErrors(accountController.buildRegister));

// Route to trigger a 500 error
router.get("/500error", (req, res, next) => {
    next({ status: 500, message: 'This is an intentional error' });
});

router.get("/update-info/:account_id", Util.checkLogin, Util.handleErrors(accountController.buildUpdateInfo));

router.get("/",  Util.checkJWTToken, Util.checkLogin , Util.handleErrors(accountController.buildManagement));

// Logout route
router.get('/logout', Util.handleErrors(accountController.logout));


router.post('/submit', function(req, res) {
    req.flash('notice', 'Your data was submitted successfully!');
    req.flash('error', 'There was an error processing your data.');
    res.redirect('/');
  });

router.post('/update', regValidate.accountUpdateRules(), Util.checkJWTToken, Util.handleErrors(accountController.updateInformation));

router.post('/change-password', Util.handleErrors(accountController.changePassword));

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
  Util.checkJWTToken,
  Util.handleErrors(accountController.accountLogin)
)

module.exports = router;