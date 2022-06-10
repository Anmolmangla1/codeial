const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req, res){
    User.findById(req.params.id, function(err, user){
        return res.render('user_profile',{
            title : "User Profile",
            profile_user: user
        });
    });
}

module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){
       
        try{
                let user = await User.findById(req.params.id);
                User.uploadedAvatar(req, res, function(err){
                    user.name = req.body.name;
                    user.email = req.body.email;

                    //this if is for as avatar is not requied in db so we are cheking if user is uploading file or not. if uploading then save the path to db
                    if(req.file){

                        //for deleteing the old picture if updating new one
                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }
                        //this is saving the path of the uplaoded file into the avatar field in the user
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();

                    return res.redirect('back');
                });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }
    
    }else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req, res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title : "Sign Up"
    });
}

module.exports.signIn = function(req, res){
    
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    return res.render('user_sign_in', {
        title : "Sign In"
    });
}

module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){

        if(err){console.log('Error in finding user in signing up'); return}
        
        if(!user){
            User.create(req.body, function(err, user){
                if(err){console.log('Error in finding user in signing up'); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }

    });

}

module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success', 'Logged out successfully');
    return res.redirect('/');
}