var nodemailer = require("nodemailer");
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

	var mailOptions = {
	   from: "noreply@projectfellows.com", // sender address
	   to: "XXX@XXX", // list of receivers
	   subject: "Hello ✔", // Subject line
	   text: "Hello world ✔" // plaintext body
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       // console.log("Message sent: " + response.message);
	   }
	});
}

