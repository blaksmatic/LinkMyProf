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
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

mongoose.connect('mongodb://yuhang:yyhYYH94@ds023108.mlab.com:23108/linkmyprof');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});


var Professor = require('./app/models/Professor');
var University = require('./app/models/University');
var User = require('./app/models/User');
var Comment = require('./app/models/Comment');

//get all the users
app.get('/user', function (req, res) {
    mongoose.model('User').find({}, function (err, User) {
        res.send(User);
    });
});

//get all the professors
app.get('/prof', function (req, res) {
    mongoose.model('Professor').find({}, function (err, Professor) {
        res.send(Professor);
    });
});
//get professors by ID
app.get('/prof/:profID', function (req, res) {
    mongoose.model('Professor').find({id: req.params.profID}, function (err, Professor) {
        res.send(Professor[0]);
    });
});
//get all the university
app.get('/univ', function (req, res) {
    mongoose.model('University').find({}, function (err, University) {
        res.send(University);
    });
});
//get professors by university
app.get('/univ/:uname', function (req, res) {
    mongoose.model('Professor').find({univ: req.params.uname}, function (err, Professor) {
        res.send(Professor);
    });
});

//get the infomation of a university
app.get('/uinfo/:uname', function (req, res) {
    mongoose.model('University').find({name: req.params.uname}, function (err, University) {
        res.send(University);
    });
});
//create user
app.post('/user/create', function (req, res) {
    //res.send('username: ' + req.body.username + '  password: ' + req.body.password + '  interest: ' +  req.body.interest);
    User.create({username: req.body.username, password: req.body.password, interest: req.body.interest},
        function (err, User) {
            if (err) {
                res.status(400)
            } else {
                res.send(req.body.username + " has been created!")
            }
            ;
        });
});
//add favorprof 
app.put('/user/addFavorProf', function (req, res) {
    User.findByIdAndUpdate(req.body.userid, {$push: {favorids: req.body.profid}},
        function (err, User) {
            if (err) {
                res.status(400)
            } else {
                res.send(req.body.userid + "'s favorprof has been updated!")
            }
            ;
        });
})

//create comment
app.post('/comment/add', function (req, res) {
    Comment.create({content: req.body.content, prof_id: req.body.id, author: req.body.author},
        function (err, User) {
            if (err) {
                res.status(400)
            } else {
                res.send("Comment has been created!")
            }
            ;
        });
});

//search prof by info
function contains(arr, obj) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

var related = [
    ['program', 'programming', 'software'],
    ['ai', 'artificial', 'intelligence'],
    ['hci', 'interaction'],
    ['graphics', 'vision'],
    ['nlp', 'natural', 'language', 'processing']
];

function proflist(list, array, k, res){
    if(k == array.length){
    res.send(list);
    }
    else
    {
        var searchword = array[k];
        console.log(searchword);
        Professor.find({
            $or: [{addr: {$regex: searchword, "$options": "i"}}, {name: {$regex: searchword, "$options": "i"}}, {
                area: {$regex: searchword, "$options": "i"}}, {univ: {$regex: searchword, "$options": "i"}}]
        }, function (err, Professor) {
            var n = 0;
            while(Professor[n]){
                if(!contains(list, Professor[n])){
                    list = list.concat(Professor[n]);
                }
                n++;
            }
            console.log(list);
            proflist(list, array, k+1, res);
        });
    }
    console.log(k);
}

app.get('/search/:info', function (req, res) {
    var info = req.params.info.toLowerCase();
    var infoword = info.split(" ");
    var search = infoword;

    for (i = 0; i < infoword.length; i++) {
        for (j = 0; j < related.length; j++) {
            if (contains(related[j], infoword[i])) {
                var index = search.indexOf(infoword[i]);
                if (index > -1) {
                    search.splice(index, 1);
                }
                search = search.concat(related[j]);
            }
        }
    }
    var ProfAll = new Array();
    console.log(search);
    proflist(ProfAll, search, 0, res);
})
    /*for (k = 0; k < search.length; k++) {

    var searchword = search[k];

    Professor.find({
        $or: [{addr: {$regex: searchword, "$options": "i"}}, {name: {$regex: info, "$options": "i"}}, {
            area: {
                $regex: searchword,
                "$options": "i"
            }
        }, {univ: {$regex: searchword, "$options": "i"}}]
    }, function (err, Professor) {
        Profinfo=Professor;
        console.log(Profinfo);
        var n = 0;
         while(Professor[n]){
         if(!contains(ProfAll, Professor[n])){
         ProfAll = ProfAll.concat(Professor[n]);
         }
         n++;
         }
    });
    console.log(Profinfo);
}});*/

/*console.log(search);
Professor.find({
    $or: [{addr: {$regex: { $in: search}, "$options": "i"}}, {name: {$regex: { $in: search}, "$options": "i"}}, {
        area: {$regex: { $in: search}, "$options": "i"}}, {univ:{$regex: { $in: search}, "$options": "i"}}]
    /*$or: [{addr: { $in: search}}, {name: { $in: search}}, {area: { $in: search}},
        {univ: { $in: search}}]
}, function (err, Professor) {
    res.send(Professor);
});*/



server.listen(3000);
console.log("Server listen to 3000");