'use strict'
const
  fs       = require('fs'),
  qfs      = require('q-io/fs'),
  Q        = require('Q'),
  readdir  = Q.denodeify(fs.readdir),
  stat     = Q.denodeify(fs.stat),

  padLeft  = function(id) {
    return ("0000" + id).slice(-4) //pad left w/ zeroes
  },

  replyWithFiles = Q.async(function*(res, dir) {
    try {
      let files = yield readdir(dir)
      Q.all(files.map(function(file) {
        return stat(dir + "/" + file).then(function(s) {
          return {name: file, isDir: s.isDirectory()}
        })
      }))
      .then(function(results) {
        res.json(200, results)
      }).done()
    } catch(err) {
      res.send(500)
    }
  }),


  dirContains = Q.async(function*(root, dir) {
    let cr = yield qfs.canonical(root)
    let cd = yield qfs.canonical(dir)
    if (cd.lastIndexOf(cr) == 0) {
      return true
    } else {
      return false
    }
  })


module.exports = function(config, app) {
  app.get(/^\/api\/presentations\/(\d+)\/files(?:\/(.*))?$/, function(req,res) {
    let
      id     = padLeft(req.params[0]),
      path   = req.params[1],
      root   = config.masterDir + "/" + id,
      target = root

    if (path) {
      target = root + "/" + path
    }
    dirContains(root, target).then(function(isContained) {
      if (isContained) {
        replyWithFiles(res, target).done()
      } else {
        res.send(404)
      }
    }, function(err) {
      res.send(404)
    })
  })

  app.get(/^\/api\/presentations\/(\d+)$/, function(req,res) {
    let
      id = padLeft(req.params[0]),
      root = config.masterDir + "/" + id

    fs.exists(root, function(exists) {
      if (exists) {
        res.json(200, {name: 'Presentation foo'})
      } else {
        res.send(404)
      }
    })
  })

}