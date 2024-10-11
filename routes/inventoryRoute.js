// Needed Resources 
const express = require("express")
const router = new express.Router() 
const Util = require("../utilities/");
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:invId", invController.buildByInvId)

// Route to trigger a 500 error
router.get("/500error", (req, res, next) => {
    next({ status: 500, message: 'This is an intentional error' });
});


module.exports = router;