const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy({
    clientID: "558080163018-2qjncsk20o4qigcanlccd7bqtgki2fdb.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function(accessToken, refreshToken, profile, done){
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if (err) {console.log('error in google strategy : ', err); return;}

            console.log(profile);

            //this if else is used for,  if user is already in database then signin and if not the sign up so its working simultaneously
            if(user){
                return done(null, user);
            }else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if (err) {console.log('error in creating user : ', err); return;}

                    return done(null, user);
                });
            }
        });
    }

));


module.exports = passport;