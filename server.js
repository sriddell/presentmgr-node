'use strict'

const
  config = {masterDir: '/Users/sriddell/work/junk/tmp'},
  app = require('./lib/app.js')(config)


app.listen(3000, function() {
  console.log("ready captain")
})