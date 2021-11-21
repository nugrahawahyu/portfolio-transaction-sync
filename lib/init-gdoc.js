const { GoogleSpreadsheet } = require('google-spreadsheet')

module.exports = async function initGdoc (docId, clientEmail, privateKey) {
  // Initialize the sheet - doc ID is the long id in the sheets URL
  // const doc = new GoogleSpreadsheet('1VFBB24BHOWzLdAZH-leBXL12tqURkAloxKTV7-92600'); // test
  const doc = new GoogleSpreadsheet(docId); // production
  
  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: clientEmail,
    private_key: privateKey,
  });
  
  await doc.loadInfo(); // loads document properties and worksheets
  
  return doc
}
