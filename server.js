/**
 * Created by admin on 3/18/16.
 */
var express = require('express');
var mongoose = require('mongoose');
app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
app.use(express.static(__dirname + '/public'));
fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

mongoose.connect('mongodb://yuhang:yyhYYH94@ds023108.mlab.com:23108/linkmyprof');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});


var Professor = require('./app/models/Professor');
var University = require('./app/models/University');
var User = require('./app/models/User');
var Comment = require('./app/models/Comment');

//get all the users
app.get('/user', function(req, res){
    mongoose.model('User').find({}, function(err,User){
        res.send(User);
    });
});

//get all the professors
app.get('/prof', function(req, res){
	mongoose.model('Professor').find({}, function(err,Professor){
		res.send(Professor);
	});
});
//get professors by ID
app.get('/prof/:profID', function(req, res){
	mongoose.model('Professor').find({id: req.params.profID}, function(err,Professor){
		res.send(Professor[0]);
	});
});
//get all the university
app.get('/univ', function(req, res){
    mongoose.model('University').find({}, function(err,University){
        res.send(University);
    });
});
//get professors by university
app.get('/univ/:uname', function(req, res){
    mongoose.model('Professor').find({univ: req.params.uname}, function(err,Professor){
        res.send(Professor);
    });
});

//get the infomation of a university
app.get('/uinfo/:uname', function(req, res){
    mongoose.model('University').find({name: req.params.uname}, function(err,University){
        res.send(University);
    });
});
//create user
app.post('/user/create', function(req, res){
    //res.send('username: ' + req.body.username + '  password: ' + req.body.password + '  interest: ' +  req.body.interest);
    User.create({username: req.body.username, password: req.body.password, interest: req.body.interest},
    function(err,User){
        if (err) {res.send('error')} else {res.send(req.body.username + " has been created!")};
    });
});
//create comment
app.post('/comment/add', function(req, res){
    Comment.create({content: req.body.content, prof_id: req.body.id, author: req.body.author},
    function(err,User){
        if (err) {res.send('error')} else {res.send("Comment has been created!")};
    });
});

//search prof
app.get('/search/:info', function(req, res){
    var info = req.params.info;
    Professor.find({$or:[{addr:{$regex: info, "$options": "i"  }}, {name:{$regex: info, "$options": "i"  }}, {area:{$regex: info, "$options": "i"  }},
        {title:{$regex: info, "$options": "i"  }}, {univ:{$regex: info , "$options": "i"  }} ]}, function(err,Professor){
        res.send(Professor);
    });
});

io.on("connection", function (socket) {

    console.log("Socket linked!");

    console.log("Start Parsing Data!");

    socket.emit("initial_data_send", "I am the initial data");

    socket.on("initial_data_from_frontend", function (data) {
        console.log(data);
    })

});


server.listen(3000);
console.log("Server listen to 3000");