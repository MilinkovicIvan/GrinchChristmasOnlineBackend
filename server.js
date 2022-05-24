//imports
const express = require('express');

//keys
const keys = require('./config/keys.js');

//create app
const app = express();

const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//routes
app.get('/authentication', async (req, res) => {
    res.send("Hello from authentication page");
});

//set listen
app.listen(keys.port, () => {
    console.log("Listening on: " + keys.port)
});