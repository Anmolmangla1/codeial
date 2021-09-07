const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req, res){

    //populat the user of each object
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        User.find({}, function(err, users){
            return res.render('home',{
                title: "Home",
                posts: posts,
                all_users: users
            });
        });
        
    });
}