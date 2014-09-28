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
	console.log(__dirname);
	var templatePath = __dirname + '/../../views/emailTemplates/registered.html';
	var templateContent = fs.readFileSync(templatePath, encoding="utf8");
	var mailOptions = {
	   from: "noreply@projectfellows.com", 
	   to: "ftkvyn@gmail.com", 
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

	var mailOptions = {
	   from: "noreply@projectfellows.com", // sender address
	   to: email, // list of receivers
	   subject: "Welcome to Project Fellows", // Subject line
	   text: "Hello!\n" // plaintext body
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       // console.log("Message sent: " + response.message);
	   }
	});
}
