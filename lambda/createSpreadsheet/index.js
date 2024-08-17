const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/drive",
});
const driveService = google.drive({ version: "v3", auth });
const sheetService = google.sheets({ version: "v4", auth });

/**
 * Creates a spreadsheet with the given title.
 *
 * @param {string} title - The title of the spreadsheet.
 * @returns {string} - The ID of the created spreadsheet.
 * @throws {Error} - If an error occurs during the creation process.
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

/**
 * Shares a spreadsheet with a user by granting them writer access.
 *
 * @param {string} spreadsheetId - The ID of the spreadsheet to be shared.
 * @param {string} email - The email address of the user to share the spreadsheet with.
 * @returns {Promise<void>} - A promise that resolves when the sharing is successful, or rejects with an error if there is an issue.
 */
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
