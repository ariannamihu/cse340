// Needed Resources 
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities/");
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:invId", invController.buildByInvId)

// Route to build inventory by management view
router.get("/", Util.checkLogin, Util.handleErrors(invController.buildByManagementView));

// Route for Add New Classification View
router.get('/add-classification', Util.checkAccountType, invController.addClassificationView);

// Route to get inventory by classification_id
router.get('/getInventory/:classification_id', Util.handleErrors(invController.getInventoryJSON))

//Route to update inventory
router.get('/edit/:inv_id', Util.checkAccountType, Util.handleErrors(invController.editInventoryView))

// Route to get the delete view
router.get("/delete/:inv_id", Util.checkAccountType, invController.buildDeleteConfirmationView)

//Route to post the delete confirmation
router.post("/delete-confirmed", Util.checkAccountType, invController.processDelete)

router.post('/submit', function(req, res) {
    req.flash('notice', 'Your data was submitted successfully!');
    req.flash('error', 'There was an error processing your data.');
    res.redirect('/');
  });

router.post(
  "/add-classification",
  Util.checkAccountType, Util.handleErrors(invController.addClassification)
)

router.post("/update/", Util.checkAccountType, Util.handleErrors(invController.updateInventory))

// Route to build add-inventory
router.get('/add-inventory', Util.checkAccountType, invController.addInventoryView);

// router.get('/inv/add-inventory', async (req, res) => {
//     const classifications = await utilities.buildClassificationList();
//     res.render('inventory/add-inventory', { title: 'Add Inventory', classifications: classifications, locals: req.locals });
//   });

router.post(
    "/add-inventory",
    Util.checkAccountType, Util.handleErrors(invController.addInventory)
  )

// Route to trigger a 500 error
router.get("/500error", (req, res, next) => {
    next({ status: 500, message: 'This is an intentional error' });
});


module.exports = router;