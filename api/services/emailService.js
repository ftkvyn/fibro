var nodemailer = require("nodemailer");
var fs = require("fs");
var _ = require("underscore");
var smtpTransport = nodemailer.createTransport("SMTP",{
   host : "smtp.postmarkapp.com",
   port: 25,
   auth: {
       user: process.env.POSTMARK_API_KEY,
       pass: process.env.POSTMARK_API_KEY
   }
});

var sendMail = function(templateName, object, email, subject){
	var templatePath = __dirname + '/../../views/emailTemplates/' + templateName;
	var templateContent = fs.readFileSync(templatePath, encoding="utf8");
	var html = _.template(templateContent)(object);
	var mailOptions = {
	   from: "noreply@projectfellows.com", 
	   to: email, 
	   subject: subject, 
	   html: html
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       console.log("Message sent: " + response.message);
	   }
	});
}

exports.sendTestMail = function () {
	sendMail('registered.html', {userName: "Name 123"}, "a3969308@trbvm.com", "Hello");
}


exports.registeredMail = function (user) {
	sendMail('registered.html', {user: user}, user.email, "Welcome to Project Fellows");
}

exports.resetPassword = function(user){
	sendMail('resetPassword.html', {user: user}, user.email, "Password reset");	
}
