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

  dirContains = function(root, dir) {
    let
      canonicalRoot = qfs.canonical(root),
      canonicalDir = qfs.canonical(dir),
      deferred = Q.defer()

    canonicalRoot.then(function(cr) {
      canonicalDir.then(function(cd) {
        if (cd.lastIndexOf(cr) == 0) {
          //we're ok, didn't try to escape directory
          deferred.resolve(true)
        } else {
          deferred.resolve(false)
        }
      }).catch(function(err) {
        deferred.reject(err)
      })
    }).catch(function(err) {
      deferred.reject(err)
    })

    return deferred.promise
  }


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
    dirContains(root, target)
      .then(function(isContained) {
        if (isContained) {
          replyWithFiles(res, target)
        } else {
          res.send(404)
        }
      },
      function(err) {
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