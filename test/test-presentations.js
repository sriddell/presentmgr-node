"use strict"

const
  expect = require('chai').expect,
  request = require('supertest'),
  path = require('path'),
  config = {masterDir: path.resolve(__dirname, '../test-data')},
  app = require('../lib/app.js')(config)

describe('Array', function() {
  it('should return 200 when getting a presention', function(done) {
    request(app)
      .get('/api/presentations/34')
      .expect(200, done)
  })

  it('should return 404 for a non-existent presentation', function(done) {
    request(app)
      .get('/api/presentations/1')
      .expect(404, done)
  })

  it('should return directory of files', function(done) {
    //console.log(0)
    request(app)
      .get('/api/presentations/34/files')
      .expect(200)
      .expect(function(res) {
        let json = res.body //supertest parses json
        expect(json).to.include({name:'file1.txt', isDir:false})
        expect(json).to.include({name:'file2.ppt', isDir:false})
        expect(json).to.include({name:'sub1', isDir:true})
        expect(json.length).to.equal(3)
      })
      .end(done)
  })

  it('should return 404 for non-existent file resource', function(done) {
    request(app)
      .get('/api/presentations/34/files/doesnotexist')
      .expect(404, done)
  })

})