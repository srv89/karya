# Karya

> A RESTful Node.js Based Todo API

Karya a basic Node.js based todo API developed as a part of learning Node.js/Express.js. The API is currently hosted on [Heroku](http://todo-api-nodejs.herokuapp.com)

### Technologies & Libraries Used:
* [Node.js](https://nodejs.org/en/) 
* [Express.js](http://expressjs.com) 
* [PostgreSQL: Sequelize ORM](http://docs.sequelizejs.com/en/latest/) 
* [SendGrid API](https://sendgrid.com/docs/Integrate/Code_Examples/nodejs.html)
* [Underscore.js](http://underscorejs.org)

### Karya API Description:
###### API Endpoint: https://todo-api-nodejs.herokuapp.com

#### Core Resources
##### 1. Todos
###### Create a todo
    Definition: POST /todos
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos
    Request Header: content-type: application/json
                    Auth: authToken
    Request Parameters: description (string)
                        completed (boolean)
    Request Body: {
                    "description":"Walk my dog",
                    "completed":false
                }
    Response Body: {
                    "id": 1,
                    "description": "Walk my dog",
                    "completed": false,
                    "userId": 1,
                    "updatedAt": "2016-02-23T07:15:51.534Z",
                    "createdAt": "2016-02-23T07:15:51.534Z"
                    }   
    
    authToken: Returned in response header during the user login request.

  
###### Retrieve a todo
    Definition: GET /todos/{id}
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos/123
    Request Header: Auth: authToken required.
    Response Body: {
                    "id": 123,
                    "description": "Book dentist appointment",
                    "completed": false,
                    "userId": 12,
                    "updatedAt": "2016-02-23T07:15:51.534Z",
                    "createdAt": "2016-02-23T07:15:51.534Z"
                    }
    
    Filter/Search : /todos/completed=true (Returns all todos with completed status as true)
                    /todos/q=appointment (Returns all todos containing 'appoinment in description')
                    /todos/completd=false&q=call (Returns all todos with completed status as false and containing 'call' in description)
                                
                                
###### Update a todo
    Definition: PUT /todos/{id} 
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos/123
    Request Header: Auth: authToken required.
    Request Parameters: description (string)
                        completed (boolean)
    Request Body: {
                    "description":"Walk my dog",
                    "completed":false
                }
    
    Note: Update only available by id. The JSON payload may contain at least one request parameter

###### Delete a todo
    Definition: DELETE /todos/{id} 
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos/123
    Request Header: Auth: authToken required.
    
    Note: Successful delete returns HTTP status 204 only

##### 2. Users
###### Create a user
    Definition: POST /users
    Example Request URI: https://todo-api-nodejs.herokuapp.com/users
    Request Header: content-type: application/json
    Request Parameters: email (string)
                        password (string)
    Request Body: {
                    "email":todo-api-user1@mailinator.com,
                    "password":"user1@todo-api"
                    }
                    
    Response Body: {
                    "id": 23,
                    "email":todo-api-user1@mailinator.com,
                    "updatedAt": "2016-02-23T07:15:51.534Z",
                    "createdAt": "2016-02-23T07:15:51.534Z"
                    }
    
###### Login a user
    Definition: POST /users/login
    Example Request URI: https://todo-api-nodejs.herokuapp.com/users/login
    Request Header: content-type: application/json
    Request Parameters: email (string)
                        password (string)
    Request Body: {
                    "email":todo-api-user1@mailinator.com,
                    "password":"user1@todo-api"
                    }
    Response Header: Auth -> authToken (JSON Web Token)
    Response Body: {
                    "id": 23,
                    "email":todo-api-user1@mailinator.com,
                    "updatedAt": "2016-02-23T07:15:51.534Z",
                    "createdAt": "2016-02-23T07:15:51.534Z"
                    }

###### Logout a user
    Definition: DELETE /users/logout
    Example Request URI: https://todo-api-nodejs.herokuapp.com/users/logout
    Request Header: Auth: authToken (JSON Web Token)
    
    Note: Successful logout destroys the Auth token and returns a 204 HTTP status. 
          Any subsequent request will require the user to login again to obtain the Auth token.

###### Reset user password
    Definition: POST /users/reset
    Example Request URI: https://todo-api-nodejs.herokuapp.com/users/reset
    Request Parameters: email (string)
    Response Body: {
                    "message": "pincode sent via email"
                    }
    
    Note: Pincode is emailed to the registered email address

###### Updated user password
    Definition: POST /users/update
    Example Request URI: https://todo-api-nodejs.herokuapp.com/users/update
    Request Parameters: email (string)
                        password (string) -> new password to update
                        pincode: (string) -> received via email while POST /users/reset request
                        
    Response Body: {
                    "message": "password updated successfully"
                    }
    
