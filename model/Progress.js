const mongoose = require('mongoose');
const { Schema } = mongoose;

//model schema for progresses in database
const progressSchema = new Schema({
    username: String,
    currentLv: Number,
    lifeAmount: Number,
    goldAmount: Number,
    powerups: String,
});

mongoose.model('progress', progressSchema);