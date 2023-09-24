const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const accountRoute = require('./routes/account');
const adminRoute = require('./routes/admin');

app.use("/account",accountRoute);
app.use("/admin",adminRoute);

module.exports = app;