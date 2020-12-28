/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  test('Clearing database', function(done) {
    chai.request(server)
      .delete('/api/books')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'complete delete successful');
        done();
      })
  })

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: 'new book' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title')
            assert.equal(res.body.title, 'new book');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
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
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai.request(server)
            .get('/api/books/5f665eb46e296f6b9b6a504d')
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'no book exists');
              done();
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: 'new book' })
          .end(function(err, res) {
            const { _id } = res.body
            chai.request(server)
              .get('/api/books/' + _id)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                const testBook = {
                  _id,
                  title: 'new book',
                  comments: []
                }
                assert.deepEqual(res.body, testBook);
                done();
              })
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      let _id;

      test('Setting initial book to update', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: 'book to update' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            _id = res.body._id;
            done();
          })
      })
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + _id)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ comment: 'This is a test comment' })
          .end(function(err, res) {
            const testBook = {
              _id,
              title: 'book to update',
              comments: ['This is a test comment']
            }
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, testBook);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/' + _id)
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/' + '5f665eb46e296f6b9b6a504d')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ comment: 'This is a test comment' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      let _id;

      test('Setting initial book to update', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({ title: 'book to update' })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            _id = res.body._id;
            done();
          })
      })

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/' + _id)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successfull');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/' + '5f665eb46e296f6b9b6a504d')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });

    });

  });

});
