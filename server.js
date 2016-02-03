var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var morgan = require('morgan');
var bcrypt = require('bcrypt');

var db = require('./db.js');
var app = express();

var PORT = process.env.PORT || 3000;
var ENV = process.env.NODE_ENV || 'development';

if (ENV === 'development') {
	app.use(morgan('common'));
}

app.use(bodyParser.json());


//GET /
app.get('/', function(req, res) {
	res.send('Todo API Root');
});


// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});


// GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

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


// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	if (typeof body.completed !== 'boolean') {
		return res.status(400).json({
			message: 'invalid completed type. "completed is of type boolean'
		});
	}

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var options = {
		where: {
			id: todoId
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
					message: "database is sqlite",
					rowsAffected: updatedRows[0]
				});
			}

		}
	}, function(e) {
		res.status(400).json(e);
	});
});


// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with id'
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});
});


// GET /users
app.get('/users', function (req, res) {
	db.user.count().then(function (users){
		res.json({"userCount": users});
	});

});


// POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user) {
		res.json(user.toPublicJSON());

	}, function(e) {
		res.status(400).json(e);
	})

});


// POST /users/login
app.post("/users/login", function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(401).send();
	});
	
});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on PORT ' + PORT + '!');
	});
});