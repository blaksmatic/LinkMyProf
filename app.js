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
    //console.log('username: ' + req.body.username + '  password: ' + req.body.password + '  interest: ' +  req.body.interest);
    User.create({
            username: req.body.username,
            password: req.body.password,
            interest: req.body.interest,
            location: req.body.location
        },
        function (err, User) {
            if (err) {
                res.status(400).send('create fails');
            } else {
                res.send(req.body.username + " has been created!");
            }
        });
});
//modify user interest
app.post('/user/modInt', function (req, res) {
    //console.log('username: ' + req.body.username + '  password: ' + req.body.password + '  interest: ' +  req.body.interest);
    User.update({username: req.body.username}, {interest: req.body.value},
        function (err, User) {
            if (err) {
                res.status(400).send('modify fails');
            } else {
                res.send(req.body.username + "'s interest has been modified!");
            }
        });
});
//user login 
app.post('/user/login', function (req, res) {
    User.findOne({username: req.body.username, password: req.body.password},
        function (err, User) {
            if (err || User == null) {
                res.status(404).send('login fails');
            } else {
                console.log(req.body.username + " has logged in");
                res.status(200).send(User);
            }
        });
});
//add favorprof 
app.put('/user/addFavorProf', function (req, res) {
    User.update({username: req.body.username}, {$push: {favorids: req.body.profid}},
        function (err, User) {
            if (err) {
                res.status(400)
            } else {
                Professor.update({id: req.body.profid}, {$inc: {likes: 1}}, function (err, User) {
                    if (err) {
                        res.status(400)
                    }
                });
                res.send(req.body.username + "'s favorprof has been updated!");
            }
        });
})
//delete favorprof
app.put('/user/DelFavorProf', function (req, res) {
    User.find({username: req.body.username},
        function (err, curUser) {
            if (err) {
                res.status(400)
            } else {
                var curlist = curUser[0].favorids;
                if (contains(curlist, req.body.profid)) {
                    var index = curlist(req.body.profid);
                    if (index > -1) {
                        curlist.splice(index, 1);
                    }
                    Professor.update({id: req.body.profid}, {$inc: {likes: -1}}, function (err, User) {
                        if (err) {
                            res.status(400)
                        }
                    });
                    User.update({username: req.body.username}, {favorids: curlist},
                        function (err, User) {
                            if (err) {
                                res.status(400)
                            }
                            else {
                                res.send(req.body.username + "'s favorprof " + req.body.profid + " has been deleted!");
                            }
                        });
                }

            }
        })
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

function proflist(list, array, k, res) {
    if (k == array.length) {
        res.send(list);
    }
    else {
        var searchword = array[k];
        console.log(searchword);
        Professor.find({
            $or: [{addr: {$regex: searchword, "$options": "i"}}, {name: {$regex: searchword, "$options": "i"}}, {
                area: {$regex: searchword, "$options": "i"}
            }, {univ: {$regex: searchword, "$options": "i"}}]
        }, function (err, Professor) {
            var n = 0;
            while (Professor[n]) {
                if (!contains(list, Professor[n])) {
                    list = list.concat(Professor[n]);
                }
                n++;
            }
            proflist(list, array, k + 1, res);
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

//return one user's infomation
app.get('/user/info/:username', function (req, res) {
    User.find({username: req.params.username}, function (err, User) {
        res.send(User[0]);
    });
});

//compare currrent user with reference user
app.post('/user/compare', function (req, res) {
    User.find({username: req.body.currUname}, function (err, User) {
        var curUfavor = User[0].favorids;
        mongoose.model('User').find({username: req.body.refUname}, function (err, User) {
            var refUfavor = User[0].favorids;
            var simi = 0;
            for (i = 0; i < curUfavor.length; i++) {
                if (contains(refUfavor, curUfavor[i])) {
                    simi++;
                }
            }
            res.send({simi});
        })
    })
})

//return a list of username and descending similarity
function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

app.get('/user/similist/:username', function (req, res) {
    User.find({username: req.params.username}, function (err, User) {
        var curUfavor = User[0].favorids;
        mongoose.model('User').find({username: {$ne: req.params.username}}, function (err, User) {
            var favorlist = new Array();
            for (i = 0; i < User.length; i++) {
                var simi = 0;
                for (j = 0; j < User[i].favorids.length; j++) {
                    if (contains(curUfavor, User[i].favorids[j])) {
                        simi++;
                    }
                }
                refUname = User[i].username;
                favorlist.push([refUname, simi]);
            }
            favorlist = sortByKey(favorlist, 'simi');
            res.send(favorlist.reverse());
        })

    });
})

//return recommend beasd on one's similarity, location, and interest.
var stateloca = [
    ['CA', 'AZ', 'WA', 'OR'],
    ['IL', 'IN', 'IA', 'KS', 'MI', 'MN', 'MO', 'NE', 'ND', 'OH'],
    ['CT', 'DE', 'DC', 'GA', 'MD', 'MA', 'NJ', 'NH', 'NY', 'PA', 'RI', 'VT']
];

/*function profIndList(datalist, idlist, uname, k, res){
 if(k == idlist.length){
 res.status(200).send(datalist);
 }
 else{
 if(idlist[k] == 0){
 profIndList(datalist, idlist, uname, k+1, res);
 }
 else{
 Professor.find({id: idlist[k].profid},function(err, curProf) {
 //var indData = merge({ind: idlist[k].ind}, {field: idlist[k].field});
 var curdata = {
 addr: curProf[0].addr,
 img: curProf[0].img,
 area: curProf[0].area,
 url: curProf[0].url,
 title: curProf[0].title,
 phone: curProf[0].phone,
 email: curProf[0].email,
 name: curProf[0].name,
 id: curProf[0].id,
 likes: curProf[0].likes,
 univ: curProf[0].univ,
 loca: curProf[0].loca,
 field: idlist[k].field,
 ind: idlist[k].ind
 };
 //console.log(curdata);
 datalist = datalist.concat(curdata);
 profIndList(datalist, idlist, uname, k+1, res);
 })
 }
 }
 }
 */
function sortByKeyDec(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}
function profRecList(list, res, callback) {
    var profIndData = new Array();
    Professor.find({}, function (err, curProf) {
        for (i = 0; i < curProf.length; i++) {
            var areaInd = 0;
            var inteInd = 0;
            var simiInd = 0;
            for (j = 0; j < list.length; j++) {
                if (curProf[i].id == list[j].profid) {
                    if (list[j].field == 'area') {
                        areaInd = list[j].ind;
                    }
                    else if (list[j].field == 'interest') {
                        inteInd = list[j].ind;
                    }
                    else if (list[j].field == 'popularity') {
                        simiInd = list[j].ind;
                    }
                }
                //curProf[i].totalInd = curProf[i].areaInd + curProf[i].inteInd + curProf[i].simiInd;
            }

            var curdata = {
                addr: curProf[i].addr,
                img: curProf[i].img,
                area: curProf[i].area,
                url: curProf[i].url,
                title: curProf[i].title,
                phone: curProf[i].phone,
                email: curProf[i].email,
                name: curProf[i].name,
                id: curProf[i].id,
                likes: curProf[i].likes,
                univ: curProf[i].univ,
                loca: curProf[i].loca,
                areaInd: areaInd, //area(location) index
                inteInd: inteInd, //interest index
                simiInd: simiInd, //similarity index
                totalInd: areaInd + inteInd + simiInd //total index
            };

            profIndData = profIndData.concat(curdata);
        }
        callback(profIndData, res);
    })
}

function indByInterst(list, array, k, curUname, req, res) {
    if (k == array.length) {
        for (i = 0; i < list.length; i++) {
            User.update({username: curUname}, {
                    $push: {
                        profRecIndex: {
                            profid: list[i].id,
                            ind: 0.35 + 0.1 * Math.random(),
                            field: 'interest'
                        }
                    }
                },
                function (err, User) {
                });
        }
    }
    else {
        var searchword = array[k];
        //console.log(searchword);
        Professor.find({area: {$regex: searchword, "$options": "i"}}, function (err, Professor) {
            var n = 0;
            while (Professor[n]) {
                if (!contains(list, Professor[n])) {
                    list = list.concat(Professor[n]);
                }
                n++;
            }
            indByInterst(list, array, k + 1, curUname, req, res);
        });
    }
    //console.log(k);
}
function addindex(req, res,callback){
    User.update({username: req.params.username}, {$set: {profRecIndex: []}}, function (err, currUser) {
    });

    User.find({username: req.params.username}, function (err, currUser1) {
        //related index with location
        var currLoca = new Array();
        currLoca = currLoca.concat(currUser1[0].location);
        for (i = 0; i < stateloca.length; i++) {
            if (contains(stateloca[i], currUser1[0].location)) {
                var index = currLoca.indexOf(currUser1[0].location);
                if (index > -1) {
                    currLoca.splice(index, 1);
                }
                currLoca = currLoca.concat(stateloca[i]);
            }
        }
        //console.log(currLoca);
        var profindex = [];
        Professor.find({}, function (err, curProfessor) {
            for (i = 0; i < curProfessor.length; i++) {
                //pid = curProfessor[i].id;
                //console.log(i+' '+curProfessor[i].id+' '+curProfessor[i].loca);
                if (contains(currLoca, curProfessor[i].loca)) {
                    User.update({username: req.params.username}, {
                            $push: {
                                profRecIndex: {
                                    profid: curProfessor[i].id,
                                    ind: 0.25 + 0.1 * Math.random(),
                                    field: 'area'
                                }
                            }
                        },
                        function (err, User) {
                        });
                }
                else {
                    User.update({username: req.params.username}, {
                            $push: {
                                profRecIndex: {
                                    profid: curProfessor[i].id,
                                    ind: 0.0,
                                    field: 'area'
                                }
                            }
                        },
                        function (err, User) {
                        });
                }
            }

        })
        //related index with likes
        var curUfavor = currUser1[0].favorids;
        User.find({username: {$ne: req.params.username}}, function (err, refUser) {
            var favorlist = new Array();
            for (i = 0; i < User.length; i++) {
                var simi = 0;
                for (j = 0; j < refUser[i].favorids.length; j++) {
                    if (contains(curUfavor, refUser[i].favorids[j])) {
                        simi++;
                    }
                }
                refUname = refUser[i].username;
                favorlist.push([refUname, simi]);
            }
            //favorlist = sortByKey(favorlist, 'simi')
            //favorlist = favorlist.reverse;
            console.log();
            User.find({username: favorlist[0][0]}, function (err, refUser2) {
                var simiidlist = refUser2[0].favorids;
                for (i = 0; i < simiidlist.length; i++) {
                    User.update({username: req.params.username}, {
                            $push: {
                                profRecIndex: {
                                    profid: simiidlist[i],
                                    ind: 0.1 + 0.1 * Math.random(),
                                    field: 'popularity'
                                }
                            }
                        },
                        function (err, User) {
                        });
                }
            })
        });
        //related index with interest
        var info = currUser1[0].interest.toLowerCase();
        if (info != null) {
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
            indByInterst(ProfAll, search, 0, req.params.username, req, res);
        }

    });
    callback(req, res);
}

function sleep(miliseconds) {

}
app.get('/user/calRec/:username', function (req, res) {
    addindex(req,res,function(req,res) {
        User.find({username: req.params.username}, function (err, finalUser) {
            if (err) {
                res.send(400);
            }
            else {
                //profIndList(profIndData, finalUser[0].profRecIndex, curUname, 0, res);
                profRecList(finalUser[0].profRecIndex, res, function (datalist, res) {
                    datalist = sortByKeyDec(datalist, 'totalInd');
                    res.status(200).send(datalist);
                })
            }
        })
    })
});

//get one's profRecIndex
app.get('/user/getRec/:username', function (req, res) {
    User.find({username: req.params.username}, function (err, finalUser) {
        if (err) {
            res.send(400);
        }
        else {
            profRecList(finalUser[0].profRecIndex, res, function (datalist, res) {
                datalist = sortByKeyDec(datalist, 'totalInd');
                res.status(200).send(datalist);
            })
        }
    })
});

//get one's index with one professor
app.get('/user/getOneRec/:username/:profid', function (req, res) {
    User.find({username: req.params.username}, function (err, finalUser) {
        if (err) {
            res.send(400);
        }
        else {
            var profIndData = new Array();
            Professor.find({id: req.params.profid}, function (err, curProf) {
                var areaInd = 0;
                var inteInd = 0;
                var simiInd = 0;
                for (j = 0; j < finalUser[0].profRecIndex.length; j++) {
                    if (curProf[0].id == finalUser[0].profRecIndex[j].profid) {
                        if (finalUser[0].profRecIndex[j].field == 'area') {
                            areaInd = finalUser[0].profRecIndex[j].ind;
                        }
                        else if (finalUser[0].profRecIndex[j].field == 'interest') {
                            inteInd = finalUser[0].profRecIndex[j].ind;
                        }
                        else if (finalUser[0].profRecIndex[j].field == 'popularity') {
                            simiInd = finalUser[0].profRecIndex[j].ind;
                        }
                    }
                    //curProf[i].totalInd = curProf[i].areaInd + curProf[i].inteInd + curProf[i].simiInd;
                }
                //console.log(areaInd,inteInd,simiInd);
                var curdata = {
                    addr: curProf[0].addr,
                    img: curProf[0].img,
                    area: curProf[0].area,
                    url: curProf[0].url,
                    title: curProf[0].title,
                    phone: curProf[0].phone,
                    email: curProf[0].email,
                    name: curProf[0].name,
                    id: curProf[0].id,
                    likes: curProf[0].likes,
                    univ: curProf[0].univ,
                    loca: curProf[0].loca,
                    areaInd: areaInd, //area(location) index
                    inteInd: inteInd, //interest index
                    simiInd: simiInd, //similarity index
                    totalInd: areaInd + inteInd + simiInd //total index
                };
                res.send(curdata);
            })
        }
    })
})

/**/


server.listen(3000);
console.log("Server listen to 3000");
