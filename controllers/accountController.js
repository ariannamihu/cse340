const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { title } = require("process")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash('notice')
    })
  }

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    messages: req.flash('notice')
  })
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Manager",
    nav,
    messages: req.flash('notice')
})
}

async function buildUpdateInfo(req, res, next, id) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id;
  const data = await accountModel.getAccountById(account_id);
  res.render("account/update", {
    title: "Update Account Information",
    account_id,
    data,
    nav,
    messages: req.flash('notice')
})
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    // Hash the password asynchronously
    let hashedPassword;
    try 
    {
        hashedPassword = await bcrypt.hash(account_password, 10); // Async bcrypt hashing
    } 
    catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }

    // Try to register the account in the database
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );

    // If registration is successful
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        );
        return res.status(201).render("account/login", {
            title: "Login",
            nav,
            messages: req.flash('notice')
        });
    }
    // If registration failed
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
        title: "Registration",
        nav,
        messages: req.flash('notice')
    });
    // console.log("We made it")
    // res.status(200).render("account/register", {
    //       title: "Registration",
    //       nav,
    //       messages: req.flash('notice')
    //   });
}

  
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
 *  Process update request
 * ************************************ */
async function updateInformation(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const accountData = await accountModel.getAccountById(account_id)
  if (!accountData) {
     req.flash("notice", "We were unable to retrieve your account.")
     res.status(400).render("/account/", {
      title: "Account Manager",
      nav,
      errors: null
     })
    return
    }
  try {
   const data = await accountModel.updateAccountInformation(account_firstname, account_lastname, account_email, account_id)
   console.log("Successful update");
   req.flash("notice", "Information was updated successfully.")
   res.render("account/management", {
    title: "Account Manager",
messages: req.flash('notice'),    nav,
    
    data
  })
  // return res.redirect('/account/')
  } catch (error) {
   return new Error('Unable to updae info')
  }
 }

 /* ****************************************
 *  Process change password request
 * ************************************ */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  const accountData = await accountModel.getAccountById(account_id)
  if (!accountData) {
     req.flash("notice", "We were unable to retrieve your account.")
     res.status(400).render("/account/", {
      title: "Account Manager",
      nav,
      errors: null
     })
    return
    }
    let hashedPassword;
    try 
    {
        hashedPassword = await bcrypt.hash(account_password, 10); // Async bcrypt hashing
    } 
    catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.');
        return res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        });
    }
  try {
   const data = await accountModel.updatePassword(hashedPassword, account_id)
   console.log("Successful password update");
   req.flash("notice", "Password was updated successfully.")
   res.render("account/management", {
    title: "Account Manager",
    messages: req.flash('notice'),    
    nav,
    data
  })
  // return res.redirect('/account/')
  } catch (error) {
   return new Error('Unable to update info')
  }
 }


 /* ****************************************
 *  Process logout request
 * ************************************ */
async function logout (req, res) {
  // Clear the JWT cookie by setting its expiration date in the past
  res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV !== 'development' });

  // Flash a message to notify the user of successful logout
  req.flash('notice', 'You have successfully logged out.');

  // Redirect the user to the home page or another appropriate page
  res.redirect('/');
};

module.exports = { buildLogin, buildRegister, registerAccount , accountLogin , buildManagement , logout , buildUpdateInfo , updateInformation , changePassword }