const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

let test_id;
chai.use(chaiHttp);

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}


suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */



  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let data = {
          title: 'jungle fever'
        }
        chai.request(server)
            .post('/api/books')
            .send(data)
            .end( (err, res) => {
              assert.equal(res.body.title, 'jungle fever')
              assert.equal(isObject(res.body), true)
              assert.exists(res.body._id)
              test_id = res.body._id;
              done();
            })

      });
      
      test('Test POST /api/books with no title given', function(done) {
        let data = {}

        chai.request(server)
            .post('/api/books')
            .send(data)
            .end( (err, res) => {
              assert.notExists(res.body._id)
              assert.equal(res.text, 'missing required field title')
              done();
            })

      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){

        chai.request(server)
            .get('/api/books')
            .end( (err, res) => {
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'response should be an array');
              assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], '_id', 'Books in array should contain _id');
              done();
            })

      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){

        chai.request(server)
            .get('/api/books/123')
            .end( (err, res) => {
              assert.equal(res.text, 'no book exists')
              done();
            })

      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        let query = '/api/books/' + test_id
        chai.request(server)
            .get(query)
            .end( (err, res) => {
              assert.equal(isObject(res.body), true)
              assert.exists(res.body._id)
              assert.exists(res.body.title)
              assert.exists(res.body.comments)
              assert.isArray(res.body.comments)
              assert.exists(res.body.commentcount)
              done();
            })

      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let data = { comment: 'jungle fever was cool' }
        let uri = '/api/books/' + test_id

        chai.request(server)
            .post(uri)
            .send(data)
            .end( (err, res) => {
              assert.equal(isObject(res.body), true)
              assert.exists(res.body._id)
              assert.exists(res.body.title)
              assert.exists(res.body.comments)
              assert.isArray(res.body.comments)
              assert.exists(res.body.commentcount)
              done()
            })

      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let data = { comment: ''}

        chai.request(server)
            .post(`/api/books/${test_id}`)
            .send(data)
            .end( (err, res) => {
                assert.equal(res.text, 'missing required field comment')
                done();
            })

      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let data = { comment: 'harry potter rulez'}

        chai.request(server)
            .post(`/api/books/fakeid`)
            .send(data)
            .end( (err, res) => {
                assert.equal(res.text, 'no book exists')
                done();
            })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        
        chai.request(server)
            .delete(`/api/books/${test_id}`)
            .end( (err, res) => {
              assert.equal(res.text, 'delete successful')
              done()
            })

      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){

        chai.request(server)
          .delete(`/api/books/fakeid`)
          .end( (err, res) => {
            assert.equal(res.text, 'no book exists')
            done()
          })
      })

    });

  });

});
