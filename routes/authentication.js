const mongoose = require('mongoose');
const User = mongoose.model('users');

//response codes
// 0 = User account match found.
// 1 = Credentials not valid.
// 2 = Username already taken!

const argon2i = require('argon2-ffi').argon2i;  //used for hashing password
const crypto = require('crypto');   //used for making salt which is used in hashing of password

module.exports = app => {
    //create part
    app.post('/authentication/create', async (req, res) => {
        var response = {};

        const { reqUsername, reqPassword } = req.body;
        //console.log(username);
        //console.log(password);

        //check if username and pass are null
        if (reqUsername == null || reqPassword == null) {
            // make a response and send it
            response.code = 1;
            response.message = "Credentials not valid.";
            res.send(response);
            return;
        }

        // check db if we dont have user with that username
        var checkUser = await User.findOne({ username: reqUsername });
        // if not
        if (checkUser == null) {
            //make new user 
            console.log("Making new user");

            //create access token
            crypto.randomBytes(32, function (err, salt) {
                if (err) {
                    console.log(err);
                }
     
                argon2i.hash(reqPassword, salt).then(async (hash) => {
                    //create new user
                    var newUser = new User({
                        username: reqUsername,
                        password: hash,
                        salt: salt
                    });
                    // wait until user is saved
                    await newUser.save();

                    // make a response and send it
                    response.code = 0;
                    response.message = "User account match found.";
                    response.data = (({ username }) => ({ username }))(newUser);
                    res.send(response);
                    return;   
                });
            });
        }
        // if yes
        else {
            // make a response and send it
            response.code = 2;
            response.message = "Username already taken!";
            res.send(response);
            return;
        }
        return;
    });

    //login part
    app.post('/authentication/login', async (req, res) => {
        var response = {};

        const { reqUsername, reqPassword } = req.body;
        //console.log(username);
        //console.log(password);

        //check if username and pass are null
        if (reqUsername == null || reqPassword == null) {
            // make a response and send it
            response.code = 1;
            response.message = "Credentials not valid.";
            res.send(response);
            return;
        }

        // check db if we have user with that username
        var checkUser = await User.findOne({ username: reqUsername });
        // if not null
        if (checkUser != null) {
            //verify that passwords match
            argon2i.verify(checkUser.password, reqPassword).then(async (success) => {
                //if success, make user
                if (success) {
                    await checkUser.save();

                    // make a response and send it
                    response.code = 0;
                    response.message = "User account match found.";
                    response.data = ( ({ username }) => ({username}) )(checkUser);
                    res.send(response);
                    return;
                }
                else {
                    // make a response and send it
                    response.code = 1;
                    response.message = "Credentials not valid.";
                    res.send(response);
                    return;
                }
            });
        }
        else {
            // make a response and send it
            response.code = 1;
            response.message = "Credentials not valid.";
            res.send(response);
            return;
        }
    });
}

