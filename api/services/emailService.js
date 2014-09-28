var nodemailer = require("nodemailer");
var fs = require("fs");
var smtpTransport = nodemailer.createTransport("SMTP",{
   host : "smtp.postmarkapp.com",
   port: 25,
   auth: {
       user: process.env.POSTMARK_API_KEY,
       pass: process.env.POSTMARK_API_KEY
   }
});

exports.sendTestMail = function () {
	// body...
	var templatePath = __dirname + '/../../views/emailTemplates/registered.html';
	var templateContent = fs.readFileSync(templatePath, encoding="utf8");
	var mailOptions = {
	   from: "noreply@projectfellows.com", 
	   to: "XXX@XXX", 
	   subject: "Hello ✔", 
	   html: templateContent
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       console.log("Message sent: " + response.message);
	   }
	});
}


exports.registeredMail = function (email) {
	// body...
	var templatePath = __dirname + '/../../views/emailTemplates/registered.html';
	var templateContent = fs.readFileSync(templatePath, encoding="utf8");
	var mailOptions = {
	   from: "noreply@projectfellows.com", 
	   to: email, 
	   subject: "Welcome to Project Fellows", 
	   html: templateContent
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       // console.log("Message sent: " + response.message);
	   }
	});
}
