var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    content: String,
    author: String, 
    prof_id: Number
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;