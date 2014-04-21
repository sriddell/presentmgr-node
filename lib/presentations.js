'use strict'
const
  fs       = require('fs'),
  qfs      = require('q-io/fs'),
  Q        = require('Q'),

  padLeft  = function(id) {
    return ("0000" + id).slice(-4) //pad left w/ zeroes
  },

  replyWithFiles = function(res, dir) {
    let allFiles = []
    fs.readdir(dir, function(err, files) {
      if (err) {
        res.send(500)
      } else {
        let total = files.length
        files.forEach(function(file) {
          fs.stat(dir + "/" + file, function(err, stat) {
            if (err) {
              res.send(404)
            } else {
              allFiles.push({name: file, isDir: stat.isDirectory()})
              total--
              if (total == 0) {
                res.json(200, allFiles)
              }
            }
          })
        })
      }
    })
  },

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
        replyWithFiles(res, target)
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