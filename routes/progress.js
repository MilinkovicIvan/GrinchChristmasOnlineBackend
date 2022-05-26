const mongoose = require('mongoose');
const Progress = mongoose.model('progress');

//response codes
// 0 = Progress record saved.
// 1 = Information not valid.
// 2 = Progress record already exist!
// 3 = Progress record found.
// 4 = Progress record not found.

module.exports = app => {

    //create part
    app.post('/progress/create', async (req, res) => {
        var response = {};

        const { reqUsername, reqCurrentLv, reqLifeAmount, reqGoldAmount, reqPowerups  } = req.body;
        //console.log(reqUsername);
        //console.log(reqPowerups);

        //check if variables are null
        if (reqUsername == null || reqCurrentLv == null || reqLifeAmount == null || reqGoldAmount == null || reqPowerups == null ) {
            // make a response and send it
            response.code = 1;
            response.message = "Information not valid.";
            res.send(response);
            return;
        }

        // check db if we dont have user with that username
        var checkProgress = await Progress.findOne({ username: reqUsername });
        // if not
        if (checkProgress == null) {
            //make new user 
            console.log("Making new progress record");

            //create new progress record
            var newProgress = new Progress({
                username: reqUsername,
                currentLv: reqCurrentLv,
                lifeAmount: reqLifeAmount,
                goldAmount: reqGoldAmount,
                powerups: reqPowerups
            });
            // wait until record is saved
            await newProgress.save();

            // make a response and send it
            response.code = 0;
            response.message = "Progress record saved.";
            res.send(response);
            return;
            
        }
        // if yes
        else {
            // make a response and send it
            response.code = 2;
            response.message = "Progress record already exist!";
            res.send(response);
            return;
        }
    });

    //fetch part
    app.post('/progress/fetch', async (req, res) => {
        var response = {};

        const { reqUsername } = req.body;
        //console.log(reqUsername);

        //check if username is null
        if (reqUsername == null) {
            // make a response and send it
            response.code = 1;
            response.message = "Information not valid.";
            res.send(response);
            return;
        }

        // check db if we dont have record with that username
        var checkProgress = await Progress.findOne({ username: reqUsername });
        // if yes
        if (checkProgress != null) {
            // make a response and send it
            response.code = 3;
            response.message = "Progress record found.";
            response.data = checkProgress;
            res.send(response);
            return;

        }
        // if no
        else {
            // make a response and send it
            response.code = 4;
            response.message = "Progress record not found.";
            res.send(response);
            return;
        }
    });

    //update part
    app.post('/progress/update', async (req, res) => {
        var response = {};

        const { reqUsername, reqCurrentLv, reqLifeAmount, reqGoldAmount, reqPowerups } = req.body;
        //console.log(reqUsername);
        //console.log(reqPowerups);

        //check if variables are null
        if (reqUsername == null || reqCurrentLv == null || reqLifeAmount == null || reqGoldAmount == null || reqPowerups == null) {
            // make a response and send it
            response.code = 1;
            response.message = "Information not valid.";
            res.send(response);
            return;
        }

        // check db if we dont have user with that username
        var checkProgress = await Progress.findOne({ username: reqUsername });
        // if yes
        if (checkProgress != null) {
            //update values of the record and store it back to db
            checkProgress.currentLv = reqCurrentLv;
            checkProgress.lifeAmount = reqLifeAmount;
            checkProgress.goldAmount = reqGoldAmount;
            checkProgress.powerups = reqPowerups;

            // wait until record is saved
            await checkProgress.save();

            // make a response and send it
            response.code = 0;
            response.message = "Progress record saved.";
            res.send(response);
            return;

        }
        // if no
        else {
            // make a response and send it
            response.code = 4;
            response.message = "Progress record not found.";
            res.send(response);
            return;
        }
    });

}