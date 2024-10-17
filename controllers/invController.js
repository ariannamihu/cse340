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
  let className = "";
  if (data.length > 0){
    className = data[0].classification_name;
  }
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

/* ***************************
 *  Build inventory by management view
 * ************************** */
invCont.buildByManagementView = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Management", 
    nav,
    classifications: classificationSelect
  })

}

invCont.addClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
  })
};

invCont.addInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classifications: classificationList
  })
};

/* ****************************************
*  Process adding classification
* *************************************** */
invCont.addClassification = async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(classification_name);

    if (regResult) {
        req.flash('notice', `Congratulations, you've added ${classification_name}.`);
        return res.redirect('/inv/add-classification'); // Redirecting to a page to show the notice
    } else {
        req.flash('error', "Sorry, the classification addition failed.");
        return res.redirect('/inv/add-classification'); // Redirecting to the same page with an error
    }
};

/* ****************************************
*  Process adding inventory
* *************************************** */
// invCont.getClassificationList = async function getClassificationList(req, res, next){
//   const classificationList = utilities.buildClassificationList();
//   res.body = classificationList;
//   return res;
// }

invCont.addInventory = async function addInventory(req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color,  classification_id} = req.body

  const regResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id);

    if (regResult) {
        req.flash('notice', `Congratulations, you've added ${inv_make, inv_model}.`);
        return res.redirect('/inv/add-inventory'); // Redirecting to a page to show the notice
    } else {
        req.flash('error', "Sorry, the inventory addition failed.");
        return res.redirect('/inv/add-inventory'); // Redirecting to the same page with an error
    }
};



invCont.triggerError = (req, res, next) => {
  // Intentionally throw an error
  throw new Error("This is an intentional error for testing purposes.");
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.processDelete = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_price,
    inv_year,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont;