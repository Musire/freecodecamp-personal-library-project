const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	title: String,
	comments: [String],
	commentcount: Number
})

module.exports = mongoose.model('book', bookSchema);
