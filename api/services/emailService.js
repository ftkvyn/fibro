//Not working.
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
   host : "XXX",
   auth: {
       user: "XXX@XXX",
       pass: "XXX"
   }
});

exports.sendTestMail = function () {
	// body...

	var mailOptions = {
	   from: "XXX@XXX", // sender address
	   to: "XXX@XXX", // list of receivers
	   subject: "Hello ✔", // Subject line
	   text: "Hello world ✔" // plaintext body
	};

	smtpTransport.sendMail(mailOptions, function(error, response){
	   if(error){
	       console.log(error);
	   }else{
	       console.log("Message sent: " + response.message);
	   }
	});
}

