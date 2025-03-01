require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};
mongoose.connect("mongodb+srv://" +
    process.env.usernameMongoDB +
    ":" +
    process.env.password +
    "@cluster0.1o96d.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require('./models/Registration');
require('./models/Blog');
const app = require('./app');

const port = 5968;

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS server running on https://localhost:${port}/home`);
});