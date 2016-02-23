module.exports = function(sequelize, DataTypes) {
	return sequelize.define('pincode', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		pincode: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: false
		}
	});
};