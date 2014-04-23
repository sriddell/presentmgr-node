'use strict'

module.exports = function(config) {
  const
    express = require('express'),
    app = express(),
    morgan = require('morgan')('dev'),
    bunyan = require('bunyan-request-logger/request-logger.js'),
    logger = bunyan({
      name:"presentmgr-req",
      streams:[
        {
          path: 'presentmgr-req.log'
        }
      ]
    })

  require('./presentations.js')(config,app)

  app.use(logger.requestLogger())
  app.use(morgan)

  app.get('/api/:name', function(req,res) {
    res.json(200, { "hello": req.params.name })
  })

  return app

}

