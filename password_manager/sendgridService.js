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
		from: 'help@todo-api-nodejs.com',
		fromname: 'Node.js Todo API',
		subject: 'Password Reset Pincode',
		text: 'Pincode: ' + pincode
	}

	sendgrid.send(payload, function(err, json) {
		if (json) {
			return callback(json);
		} else {
			return callback(err);
		}
	});

}

module.exports.sendEmail = sendEmail;


