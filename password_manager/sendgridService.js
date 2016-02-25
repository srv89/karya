var ENV = process.env.NODE_ENV || 'development';

if (ENV === "development") {
	var config = require('../.env/config.js');
	var SENDGRID_API_KEY = config.SENDGRID_API_KEY;
} else {
	var SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
};

var sendgrid = require('sendgrid')(SENDGRID_API_KEY);


var sendEmail = function (pincode, userEmail, callback) {
	var payload = {
		to: userEmail,
		from: 'support@karya.herokuapp.com',
		fromname: 'KaryaApp Support',
		subject: 'KaryaApp Password Reset',
		replyto: 'sarveshsadhoo@gmail.com',
		text: "Hey there, " + 
				"\n\nSome one requested a new password for your account."+ 
				"\n\nPlease use the pin " + pincode + " to reset your password."+
				"\n\nIf you did not request the password change, kindly ignore this email."+
				"\n\nThanks," +
				"\nKarya App" + 
				"\n\nP.S: We would love to hear from you and helping you with any issue. Please feel free to reply to this email."
	}

	sendgrid.send(payload, function(err, json) {
		if (json) {
			callback(json);
		} else {
			callback(err);
		}
	});

}

module.exports.sendEmail = sendEmail;


