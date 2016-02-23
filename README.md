# todo-api-nodejs

> A RESTful Node.js Based Todo API

This is a basic Node.js based todo API developed as a part of learning Node.js/Express.js. The API is currently hosted on [Heroku](http://todo-api-nodejs.herokuapp.com)

### Technologies & Libraries Used:
* [Node.js](https://nodejs.org/en/) 
* [Express.js](http://expressjs.com) 
* [PostgreSQL: Sequelize ORM](http://docs.sequelizejs.com/en/latest/) 
* [SendGrid API](https://sendgrid.com/docs/Integrate/Code_Examples/nodejs.html)
* [Underscore.js](http://underscorejs.org)

### Todo API Description:
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
    Example JSON Payload: { 
                            "description":"Walk my dog",
                            "completed":false
                          }
    Example Response: {
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
    Example Response: {
                        "id": 123,
                        "description": "Book dentist appointment",
                        "completed": false,
                        "userId": 12,
                        "updatedAt": "2016-02-23T07:15:51.534Z",
                        "createdAt": "2016-02-23T07:15:51.534Z"
                        }
    
    Filter/Search : /todos/completed=true (Returns all todos with completed status as true)
                    /todos/q=appointment (Returns all todos containing 'appoinment in description')
                    /todoscompletd=false&q=call (Returns all todos with completed status as false and containing 'call' in description)
                                
                                
###### Update a todo
    Definition: PUT /todos/{id} 
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos/123
    Request Header: Auth: authToken required.
    Request Parameters: description (string)
                        completed (boolean)
    Example JSON Payload: { 
                            "description":"Walk my dog",
                            "completed":false
                          }
    
    Note: Update only available by id. The JSON payload may contain at least one request parameter

###### Delete a todo
    Definition: DELETE /todos/{id} 
    Example Request URI: https://todo-api-nodejs.herokuapp.com/todos/123
    Request Header: Auth: authToken required.
    
    Note: Successful delete return HTTP status 204 only

##### 2. Users







