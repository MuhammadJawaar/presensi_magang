const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());

const accountRoute = require('./routes/account');
const adminRoute = require('./routes/admin');
const userRoute = require('./routes/user');
const imageRoute = require('./routes/image');

app.use(cors());
app.use("/account",accountRoute);
app.use("/admin",adminRoute);
app.use("/user",userRoute);
app.use("/images",imageRoute);
app.use("/uploads", express.static('uploads'));

module.exports = app;