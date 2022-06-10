const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res){

    let post = await Post.findById(req.body.post);

    if(post){

        let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
        });

        post.comments.push(comment);
        post.save();

        if (req.xhr){
            // Similar for comments to fetch the user's id!
            comment = await comment.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Post created!"
            });
        }

        return res.redirect('/');
        
    }
}

module.exports.destroy = async function(req, res){

    let comment = await Comment.findById(req.params.id);

    if(comment.user == req.user.id){

        let postID = comment.post;

        comment.remove();

        Post.findByIdAndUpdate(postID, { $pull:{comments: req.params.id}});

        // send the comment id which was deleted back to the views
        if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }
        
        return res.redirect('back');
            
    }else{
        return res.redirect('back');
    }

}