'use strict'

module.exports = function(config) {
  const
    express = require('express'),
    app = express(),
    morgan = require('morgan'),
    logger = morgan('dev')

  require('./presentations.js')(config,app)

  app.use(logger)

  app.get('/api/:name', function(req,res) {
    res.json(200, { "hello": req.params.name })
  })

  return app

}

