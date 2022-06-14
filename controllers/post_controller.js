const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req, res){

    let post = await Post.create({
        content: req.body.content,
        user: req.user._id
    });

    //xhr is type of request which ajax gives
    if (req.xhr){

    // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
    post = await post.populate('user', 'name').execPopulate();

        return res.status(200).json({
            data: {
                post_data: post
            },
            message: "Post created!!"
        });
    }

    req.flash('success', 'Post created');
    return res.redirect('back');
}

module.exports.destroy = async function(req, res){
    let post = await Post.findById(req.params.id);

        // .id means coverting the object id in string
        if(post.user == req.user.id){

            //delete the associated likes for the post and all its comment likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.remove();

            await Comment.deleteMany({post: req.params.id});

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            req.flash('success', 'Post Deleted');
            return res.redirect('back');

        }else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }

}