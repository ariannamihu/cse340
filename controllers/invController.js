const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  console.log("Requested Inventory ID: ", inv_id); // Log the requested inv_id
  try {
      const data = await invModel.getInventoryByInvId(inv_id);
      console.log("Retrieved Data: ", data); // Log what data is retrieved

      if (!data) {
          return res.status(404).render("404", { title: "Not Found", nav: await utilities.getNav() });
      }

      const grid = await utilities.buildInvGrid(data);
      const nav = await utilities.getNav();

      res.render("./inventory/detail", {
          title: "Details",
          nav,
          grid,
      });
  } catch (error) {
      console.error("Error building inventory by ID: " + error);
      next(error);
  }
};

invCont.triggerError = (req, res, next) => {
  // Intentionally throw an error
  throw new Error("This is an intentional error for testing purposes.");
};


module.exports = invCont;