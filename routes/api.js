/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let books = await Book.find({});
      try {
        let newBooks = []
        books.forEach(book => {
          newBooks.push({
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          });
        });
        res.json(newBooks);
      } catch (err) {

      }
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        if (!title) throw new Error("missing required field title");
        const book = await new Book({ title }).save();
        res.json(book);
      } catch (err) {
        res.json(err.message);
      }
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany({});
        return res.json('complete delete successful');
      } catch (err) {

      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]
      try {
        const book = await Book.findById(bookid);
        if (book) return res.json(book);
        return res.json('no book exists');
      } catch (err) {
        return res.json('no book exists');
      }
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      try {
        let comment = req.body.comment;
        if (!comment) return res.json('missing required field comment');
        const book = await Book.findByIdAndUpdate(bookid, {$push: { comments: comment}}, { new: true})
        if (!book) return res.json('no book exists');
        return res.json(book);
      } catch (err) {
        return res.json('no book exists');
      }
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) return res.json('no book exists');
        return res.json('delete successful');
      } catch (err) {
        return res.json('no book exists');
      }
      //if successful response will be 'delete successful'
    });
  
};
