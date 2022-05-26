//imports
const express = require('express');
//keys
const keys = require('./config/keys.js');
//create app
const app = express();
//body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//db setup
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//setup db models
require('./model/User');
require('./model/Progress');

//routes
require('./routes/authentication.js')(app);
require('./routes/progress.js')(app);

//set listen
app.listen(keys.port, () => {
    console.log("Listening on: " + keys.port)
});