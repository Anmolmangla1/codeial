const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

//part which sends the email
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'anmolmangla1@gmail.com',
        pass: 'khdqqtvlaxfxuayw'
    }
});

//how the mail would look
let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, template){
            if(err){console.log('error in rendering template'); return}

            mailHTML = template;
        }
    );

    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}