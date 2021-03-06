const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer'); 
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

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

        comment = await comment.populate('user', 'name email').execPopulate();
        //commentsMailer.newComment(comment);

        let job = queue.create('emails', comment).save(function(err){
            if(err){console.log('error in creating a queue ');}

            console.log('job enque: ',job.id);
        });

        if (req.xhr){
            // Similar for comments to fetch the user's id!
            
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

        //destroy the associated likes for this comment
        await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

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