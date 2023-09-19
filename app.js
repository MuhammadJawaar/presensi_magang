const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const postsRoutes = require('../route/post');

app.use("/posts",postsRoutes);

module.exports = app;