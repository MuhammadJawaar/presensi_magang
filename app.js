const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const accountRoute = require('./routes/account');
const adminRoute = require('./routes/admin');
const userRoute = require('./routes/user');
const imageRoute = require('./routes/image');

app.use("/account",accountRoute);
app.use("/admin",adminRoute);
app.use("/user",userRoute);
app.use("/images",imageRoute);
app.use("/uploads", express.static('uploads'));

module.exports = app;