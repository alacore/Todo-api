var multer = require('multer');
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var path = require('path');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).array('userPhoto',5);

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', './public/views');


app.use(bodyParser.json());

app.post('/todos/photo', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.get('', function(req, res) {
    res.send('Todo API Root');
});

app.get('/todos', function(req, res) {

    var queryParams = req.query;
    var filteredTodos = todos;
    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, { completed: true });
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {

        filteredTodos = _.where(filteredTodos, { completed: false });
    }

    if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.indexOf(queryParams.q) > -1;
        });
    }
    res.render('index', { title: 'Hey', message: 'Hello there!', todos: filteredTodos });
    // res.json(filteredTodos);
});

//Вот так вот 
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoId });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
    // res.send('Asking for todo with id of ' + req.params.id);
});

app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

        return res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = todoNextId++;
    todos.push(body);

    console.log('description: ' + body.description);
    res.json(body);
});


app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoId });

    if (!matchedTodo) {
        res.status(404).json("error: ", "no todo found with that id");
    } else {
        todos = _.without(todos, matchedTodo);
    }
    res.json(matchedTodo);
});

app.put('/todos/:id', function(req, res) {

    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, { id: todoId });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    matchedTodo = _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});


app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
