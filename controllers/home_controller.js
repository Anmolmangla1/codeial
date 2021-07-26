const Post = require('../models/post');

module.exports.home = function(req, res){

    //populat the user of each object
    Post.find({}).populate('user').exec(function(err, posts){
        return res.render('home',{
            title: "Home",
            posts: posts
        });
    });
}