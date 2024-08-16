/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
async function create(title) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const service = google.sheets({ version: "v4", auth });
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

async function share(spreadsheetId, email) {
  const { GoogleAuth } = require("google-auth-library");
  const { google } = require("googleapis");

  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/drive",
  });

  const service = google.drive({ version: "v3", auth });
  const resource = {
    type: "user",
    role: "writer",
    emailAddress: email,
  };
  try {
    await service.permissions.create({
      resource,
      fileId: spreadsheetId,
      fields: "id",
    });
    console.log(`Spreadsheet shared with: ${email}`);
  } catch (err) {
    // TODO (developer) - Handle exception
    throw err;
  }
}

//create("My Spreadsheet");
share("1KQqd4clySh9AKH9ZWioIXn0O5MXYWd5E-X6Vux2iPhU", "kal036@ucsd.edu");
console.log("Function executed");
