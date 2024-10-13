const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get all inventory items by inv_id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
      const data = await pool.query(
          `SELECT *
          FROM public.inventory
          WHERE inv_id = $1;`,
          [inv_id]
      );
      return data.rows[0]; // Return the first row directly
  } catch (error) {
      console.error("Error fetching inventory by ID: " + error);
      throw error; // Re-throw for handling upstream
  }
}



async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0; // Returns true if insertion was successful
  } catch (error) {
    console.error("Error adding classification: ", error);
    return false; // Return false in case of error
  }
}

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id){
  try{
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2,$3, $4, '/images/vehicles/no-image.png', '/images/vehicles/no-image-tn.png', $5, $6, $7, $8) RETURNING *"
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, Number(inv_price), Number(inv_miles), inv_color, classification_id]);
    return result.rowCount > 0; // Returns true if insertion was successful
  } catch (error) {
    console.error("Error adding inventory: ", error);
    return false; // Return false in case of error
  }
  }


  module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId, addClassification, addInventory};