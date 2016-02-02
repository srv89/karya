module.exports = function (sequelize, DateTypes) {
	return sequelize.define('user', {
		email: {
			type: DateTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			},
			hooks : {
				beforeValidate: function (user, option) {
					if (typeof user.email === 'string') {
						user.email = user.email.toLowerCase();
					}
				}
			}
		},
		password: {
			type: DateTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	});
}