var db = require('../db.js');
var shortid = require('shortid');
var sendgrid = require('./sendgridService.js');


function deletePincode(userData, callback) {
	db.pincode.destroy({
		where: {
			email: userData.email
		}
	}).then(function(rowsDeleted) {
		callback(rowsDeleted);
	}, function(e) {
		callback(e);
	})
}

var resetPassword = function(userData, callback) {
	var options = {
		where: {
			email: userData.email
		}
	}
	db.user.update(userData, options).then(function(updatedUser) {
		callback(updatedUser);
		deletePincode(userData, function(data) {
			console.log("deletePincode func:", data)
		});
	}, function(e) {
		callback(e);
	});

}

function savePincode(pincode, callback) {
	db.pincode.create(pincode).then(function(pincode) {
		return callback(pincode.toJSON());
	}, function(e) {
		return callback(e.toJSON());
	});

}

var sendPincode = function(user, callback) {
	var pincodeData = {
		email: user.email,
		pincode: shortid.generate()
	};

	savePincode(pincodeData, function(savedPincode) {
		sendgrid.sendEmail(savedPincode.pincode, savedPincode.email, function(emailStatus) {
			return callback(emailStatus);
		});
	});
};

module.exports.resetPassword = resetPassword;
module.exports.sendPincode = sendPincode;