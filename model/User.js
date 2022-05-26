const mongoose = require('mongoose');
const { Schema } = mongoose;

//model schema for users in database
const userSchema = new Schema({
    username: String,
    password: String,
    salt: String,
});

mongoose.model('users', userSchema);