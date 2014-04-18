"use strict"

const
  assert = require('assert'),
  request = require('supertest'),
  config = {masterDir: '/Users/sriddell/work/junk/tmp'},
  app = require('../lib/app.js')(config)

describe('Array', function() {
  it('should return 200 when getting a presention', function(done) {
    request(app)
      .get('/api/presentations/34')
      .expect(200, done)
  })

  it('should return 404 for non-existent file resource', function(done) {
    request(app)
      .get('/api/presentations/34/files/doesnotexist')
      .expect(404, done)
  })
})