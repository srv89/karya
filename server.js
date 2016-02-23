var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var morgan = require('morgan');
var bcrypt = require('bcrypt');
var passwordManager = require('./password_manager/passwordManager.js');


var db = require('./db.js');
var middleware = require('./middleware.js')(db);

var app = express();

var PORT = process.env.PORT || 3000;
var ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') {
	app.use(morgan('common'));
}

app.use(bodyParser.json());


//GET (Path: /)
app.get('/', function(req, res) {
	res.send('Todo API Using Node.js');
});


// GET (Path: /todos/:id)
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var where = {
		id: todoId,
		userId: req.user.id
	};

	db.todo.findOne({
		where: where
	}).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});


// GET (Path: /todos?completed=false&q=work)
app.get('/todos', middleware.requireAuthentication, function(req, res) {
	var query = req.query;
	var where = {
		userId: req.user.id
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		if (ENV === 'production') {
			where.description = {
				$iLike: '%' + query.q + '%'
			}
		} else {
			where.description = {
				$like: '%' + query.q + '%'
			}
		}

	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});


// POST (Path: /todos) 
app.post('/todos', middleware.requireAuthentication, function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	body.userId = req.user.id;

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});


// PUT (Path: /todos/:id)
app.put('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var options = {
		where: {
			id: todoId,
			userId: req.user.id
		}
	}

	if (ENV === 'production') { // Setting Postgres database to return affected row
		options.returning = true;
	}

	db.todo.update(body, options).then(function(updatedRows) {
		if (updatedRows[0] === 0) {
			return res.status(404).send();
		} else if (updatedRows[0] === 1) {
			if (ENV === 'production') { // Postgres database returns affected rows. Sqlite only returns no.of affected rows
				var updatedTodo = updatedRows[1][0].dataValues;
				return res.json(updatedTodo);
			} else {
				return res.json({
					message: "todo updated successfully",
					rowsAffected: updatedRows[0]
				});
			}

		}
	}, function(e) {
		res.status(400).json(e);
	});
});


// DELETE (Path: /todos/:id)
app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.id
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'no todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});


// GET (Path: /users)
app.get('/users', function(req, res) {
	db.user.count().then(function(userCount) {
		res.json({
			"userCount": userCount
		});
	});

});


// POST (Path: /users)
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());

	}, function(e) {
		res.status(400).json(e);
	})

});


// POST (Path: /users/login)
app.post('/users/login', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function(user) {
		var token = user.generateToken('authentication');
		userInstance = user;

		return db.token.create({
			token: token
		});
	}).then(function(tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function() {
		res.status(401).send();
	});
});


// DELETE (Path: /users/logout)
app.delete('/users/logout', middleware.requireAuthentication, function(req, res) {
	req.token.destroy().then(function() {
		res.status(204).jspon();
	}).catch(function() {
		res.status(500).send();
	})
});


// POST (Path: /users/reset)
app.post('/users/reset', function(req, res) {
	var body = _.pick(req.body, 'email');
	var where = {
		email: body.email
	};

	db.user.findOne({
		where: where
	}).then(function(user) {
		if (user) {
			passwordManager.sendPincode(user, function (emailStatusData) {
				if (emailStatusData.message === "success") {
					res.status(200).json({
						"message": "pincode sent via email"
					});
				} else {
					res.status(500).json({
						"message": "could not process request"
					})
				};

			});
		} else {
			res.status(404).json({
				"message": "could not find user"
			});
		};
	}, function(e) {
		console.log(e);
		res.status(500).json({
			"message": "could not process request"
		})
	});
});

// POST (Path: /users/update)
app.post('/users/update', function(req, res) {
	var body = _.pick(req.body, 'email', 'password', 'pincode');
	var userData = _.pick(body, 'email', 'password');
	var where = {
		email: body.email,
		pincode: body.pincode
	};

	db.pincode.findOne({
		where: where
	}).then(function(pincodeData) {
		if (pincodeData) {
			passwordManager.resetPassword(userData, function (updatedUser) {
				if (updatedUser[0] === 1) {
					res.status(200).json({"message": "password updated successfully"});
				} else {
					res.status(500).json({"message": "could not update password"});
				}
				
			});
		} else {
			res.status(404).json({
				"message": "could not find valid pincode associated with the user"
			});
		}
	}, function(e) {
		res.status(500).json({
			"message": "could not process request"
		});
	});

})



db.sequelize.sync({
	force: true
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on PORT ' + PORT + '!');
	});
});