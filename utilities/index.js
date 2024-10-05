const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error(err); // Log the error details
    next(err); // Pass the error to the next middleware
  });

module.exports = Util


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


/* **************************************
 * Build the detail view HTML
 * ************************************ */
Util.buildInvGrid = async function(vehicle) {
  let grid = ''; // Initialize grid as an empty string

  // Check if the vehicle object is provided and is valid
  if (vehicle) {
    grid += `
        <div class="vehicle-detail">
            <div class="vehicle-image">
                <img src="${vehicle.inv_image}" alt="${vehicle.inv_model}">
            </div>
            <div class="vehicle-info">
                <h3>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h3>
                <p>Description: ${vehicle.inv_description}</p>
                <p>Price: $${Number(vehicle.inv_price).toLocaleString()}</p>
                <p>Miles: ${Number(vehicle.inv_miles).toLocaleString()}</p>
                <p>Color: ${vehicle.inv_color}</p>
            </div>
        </div>
    `;
  } else {
    // If no vehicle details are found
    grid += '<p class="notice">Sorry, no matching vehicle details could be found.</p>';
  }

  return grid; // Return the constructed HTML
};
