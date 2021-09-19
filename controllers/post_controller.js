const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){

    await Post.create({
        content: req.body.content,
        user: req.user._id
    });

    req.flash('success', 'Post created');
    return res.redirect('back');
}

module.exports.destroy = async function(req, res){
    let post = await Post.findById(req.params.id);

        // .id means coverting the object id in string
        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});
            req.flash('success', 'Post Deleted');
            return res.redirect('back');

        }else{
            req.flash('error', 'You cannot delete this post');
            return res.redirect('back');
        }

}