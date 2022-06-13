const nodeMailer = require('../config/nodemailer');

//this is another way of exporting a method and using arrow function
exports.newComment = (comment) => {
    console.log('inside new comment mailer');

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'anmolmangla1996@gmail.com',
        to: comment.user.email,
        subject: "New comment published",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('message sent', info);
        return;
    });
}