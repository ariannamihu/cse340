const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account found")
  }
}

async function updateAccountInformation(account_firstname, account_lastname, account_email, account_id) {
  try {
    // Update the account information
    console.log('Updating account with:', { account_id, account_firstname, account_lastname, account_email });
    const result = await pool.query(
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4;',
      [account_firstname, account_lastname, account_email, account_id]
    );

    // Check if the update was successful
    if (result.rowCount === 0) {
      throw new Error("No matching account found to update");
    }

    return { success: true, message: 'Account information updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function updatePassword(account_password, account_id) {
  try {
    // Update the account information
    console.log('Updating account with:', { account_password, account_id });
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id = $2;',
      [account_password, account_id]
    );
    // Check if the update was successful
    if (result.rowCount === 0) {
      throw new Error("No matching account found to update");
    }
    return { success: true, message: 'Account information updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

  module.exports = { registerAccount, checkExistingEmail , getAccountByEmail , getAccountById , updateAccountInformation , updatePassword}