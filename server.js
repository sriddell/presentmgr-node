'use strict'

const
  config = {masterDir: './test-data'},
  app = require('./lib/app.js')(config)


app.listen(3000, function() {
  console.log("ready captain")
})