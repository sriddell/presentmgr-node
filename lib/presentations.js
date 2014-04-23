'use strict'
const
  fs       = require('fs'),
  path     = require('path'),
  Q        = require('q'),
  readdir  = Q.denodeify(fs.readdir),
  stat     = Q.denodeify(fs.stat),
  log      = require('./log.js')(),

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
      res.send(404)
    }
  }),


  dirContains = function(root, dir) {
    let cr = path.normalize(root)
    let cd = path.normalize(dir)
    if (cd.lastIndexOf(cr) == 0) {
      return true
    } else {
      return false
    }
  }


module.exports = function(config, app) {
  app.get(/^\/api\/presentations\/(\d+)\/files(?:\/(.*))?$/, function(req,res) {
    let
      id     = padLeft(req.params[0]),
      path   = req.params[1],
      root   = config.masterDir + "/" + id,
      target = root

    log.trace("Servicing %s as a files request", req.url)
    if (path) {
      target = root + "/" + path
    }
    if (dirContains(root, target)) {
      try {
        replyWithFiles(res, target).done()
      } catch(err) {
        //console.log(err)
        res.send(500)
      }
    } else {
      res.send(404)
    }
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