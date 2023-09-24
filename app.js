const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const accountRoute = require('./routes/account');

app.use("/account",accountRoute);

module.exports = app;