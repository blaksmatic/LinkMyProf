var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UniversitySchema = new Schema({
    state: String, 
    rank: Number,
    name: String,
    fullname: String,
    pic: String
});

var University = mongoose.model('University', UniversitySchema);

module.exports = University;