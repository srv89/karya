# todo-api-nodejs

> A RESTful Node.js Based Todo API

This is a basic Node.js based todo API developed as a part of learning Node.js/Express.js. The API is currently hosted on [Heroku](http://todo-api-nodejs.herokuapp.com)

### Technologies & Libraries Used:
* [Node.js](https://nodejs.org/en/) 
* [Express.js](http://expressjs.com) 
* [PostgreSQL: Sequelize ORM](http://docs.sequelizejs.com/en/latest/) 
* [SendGrid API](https://sendgrid.com/docs/Integrate/Code_Examples/nodejs.html)
* [Underscore.js](http://underscorejs.org)
* 

### Todo API Description:
###### API Endpoint: https://todo-api-nodejs.herokuapp.com

#### Core Resources
##### 1. Todos
###### Create a todo
    Definition: POST /todos
    Example Request: https://todo-api-nodejs.herokuapp.com/todos
    Request Parameters: description (string)
                        completed (boolean)
    Example JSON Payload: { 
                            "description":"Walk my dog",
                            "completed":true
                          }

  
Retrieve
      GET /todos
      
  

##### 2. Users







