  'use strict';
  const books = require('../models/book')

  module.exports = function (app) {

    app.route('/api/books')
      .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let doc = await books.find({})
      if (doc) {res.json(doc)}


      })
      
      .post(async (req, res) => {
        let title = req.body.title;
        let commentcount = 0;
        //response will contain new book object including atleast _id and title
        if (title) {
          let record = new books({title, commentcount})
          await record.save( (err,doc) => {
            if (!err && doc) {
              let {_id, title} = doc
              res.json({ _id, title })
            } else {
              res.send('error in the saving of the document')
            }
          })
        } else {
          res.send('missing required field title');
        }

      })
      
      .delete( (req, res) => {
        //if successful response will be 'complete delete successful'
        books.deleteMany({}, (err) => {
          if (!err) {
            return res.send('complete delete successful')
          }
        })
      });



    app.route('/api/books/:id')
      .get(function (req, res){
        let bookid = req.params.id;
        let filter = { _id: bookid}
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
        
        if (bookid) {
          books.findOne(filter, (err, book) => {
            if (!err && book) {
              res.json(book)
            } else {
              res.send('no book exists');
            }
          })
        }

      })
      
      .post(async (req, res) => {
        let bookid = req.params.id;
        let comment = req.body.comment;
        //json res format same as .get

        let filter = {_id: bookid}
        let options = {new: true}
        let update = { $push : { comments: comment } }

        if (!comment) {
          return res.send('missing required field comment');
        }

        if (bookid) {
          books.findOneAndUpdate(filter, update , options, async (err, data) => {
            if (!err, data) {
              data.commentcount = data.commentcount + 1;
              data.save();
              res.send(data)
            } else {
              res.send('no book exists')
            }
          })
        }
          

      })
      
      .delete( async (req, res) => {
        let bookid = req.params.id;
        let filter = {_id: bookid};
        //if successful response will be 'delete successful'

        if (bookid) {
          books.findOneAndDelete(filter, (err, doc) => {
            if (!err && doc) {
              res.send('delete successful')
            } else {
              res.send('no book exists')
            }
          })
        } 

      });
    
  };
