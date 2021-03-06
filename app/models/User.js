var mongoose = require('mongoose');
var unique = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: {type: String, required: true, unique: true}, 
    password: {type: String, required: true},
    favorids: {type: [Number], default: [] },
    interest: String,
    location: String,
    profRecIndex:{type: [{profid: Number, ind: Number, field: String}], default:[]}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;