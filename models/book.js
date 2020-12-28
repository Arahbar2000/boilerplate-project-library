const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
        type: String
    },
    comments: {
        type: [String],
        default: []
    }
}, {
    versionKey: false,
    toObject: {
        transform: function(doc, ret) {
            
        }
    }
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;