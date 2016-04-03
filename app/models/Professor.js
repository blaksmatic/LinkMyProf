var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProfessorSchema = new Schema({
    addr: String, 
    img: String, 
    area: String, 
    url: String, 
    title: String, 
    phone: String, 
    email: String, 
    name: String,
    id: Number,
    univ: String
});

var Professor = mongoose.model('Professor', ProfessorSchema);

module.exports = Professor;



