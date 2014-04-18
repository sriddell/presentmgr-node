'use strict'

const
  express = require('express'),
  app = express(),
  morgan = require('morgan'),
  logger = morgan('dev'),
  config = {masterDir: '/Users/sriddell/work/junk/tmp'};

require('./lib/presentations.js')(config,app)


app.use(logger)

app.get('/api/:name', function(req,res) {
  res.json(200, { "hello": req.params.name })
})

app.listen(3000, function() {
  console.log("ready captain")
})