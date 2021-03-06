const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


//authentication using passport and find a user and establishing the identity
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    },
    function(req, email, password, done){
        //find a user
        User.findOne({email: email}, function(err, user){
            if(err){
                req.flash('error', err);
                return done(err);
            }

            if(!user || user.password != password){
                req.flash('error' ,'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }

));



//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});


//deserailising the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user');
            return done(err);
        }
        
        return done(null, user);
    });
});

//check if user is authenticated or not
passport.checkAuthentication = function(req, res, next){
    //if user is signed in then pass on request to next function 
    if(req.isAuthenticated()){
        return next();
    }

    // if user is not signed in
    return res.redirect('/users/sign-in');
}


passport.setAuthenticatedUser = function(req, res, next){
    //if user is signed in then pass on request to next function 
    if(req.isAuthenticated()){
        //req.user contain the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

module.exports = passport;