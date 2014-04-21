'use strict'
const
  fs       = require('fs'),
  qfs      = require("q-io/fs"),
  padLeft  = function(id) {
    return ("0000" + id).slice(-4) //pad left w/ zeroes
  },
  replyWithFiles = function(res, dir) {
    let allFiles = []
    fs.readdir(dir, function(err, files) {
      if (err) {
        res.send(404)
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
  }


module.exports = function(config, app) {
  app.get(/^\/api\/presentations\/(\d+)\/files(?:\/(.*))?$/, function(req,res) {
    let id = padLeft(req.params[0])
    let path = req.params[1]
    let
      root = config.masterDir + "/" + id,
      target = root,
      resolvedRoot = qfs.canonical(root)

    if (path) {
      target = root + "/" + path
    }
console.log("target=" + target)
    let resolvedTarget = qfs.canonical(target)

    resolvedRoot.then(function(rd) {
      console.log("rd=" + rd)
      resolvedTarget.then(function(rt) {
        console.log("rt=" + rt)
        if (rt.lastIndexOf(rd) == 0) {
          //we're ok, didn't try to escape directory
          replyWithFiles(res,rt)
        } else {
          res.send(404)
        }
      }).catch(function(err) {
        console.log(err)
        throw err
      })
    }).catch(function(err) {
      console.log("promises not kept...")
      throw err
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