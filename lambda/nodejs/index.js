const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/drive",
});
const driveService = google.drive({ version: "v3", auth });
const sheetService = google.sheets({ version: "v4", auth });

/**
 * Create a google spreadsheet
 * @param {string} title Spreadsheets title
 * @return {string} Created spreadsheets ID
 */
async function create(title) {
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await sheetService.spreadsheets.create({
      resource,
      fields: "spreadsheetId",
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    console.log("create error: ", err);
    throw err;
  }
}

async function share(spreadsheetId, email) {
  console.log("credentialsl oaded");
  const resource = {
    type: "user",
    role: "writer",
    emailAddress: email,
  };
  try {
    await driveService.permissions.create({
      resource,
      fileId: spreadsheetId,
      fields: "id",
    });
    console.log(`Spreadsheet shared with: ${email}`);
  } catch (err) {
    console.log("share error: ", err);
    throw err;
  }
}

exports.handler = async (event) => {
  const { title, email } = event;
  const spreadsheetId = await create(title);
  await share(spreadsheetId, email);
};
