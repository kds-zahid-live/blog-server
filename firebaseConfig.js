const admin = require('firebase-admin');
const serviceAccount = require('./blogz-64330-firebase-adminsdk-6ay8d-d8f45a1898.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { db };