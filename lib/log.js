module.exports = function () {
  return require('bunyan').createLogger({
      name:"presentmgr",
      streams:[
        {
          stream: process.stdout,
        },
        {
          level: 'trace',
          path: 'presentmgr.log'
        }
      ]
    })
}