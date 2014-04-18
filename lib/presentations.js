'use strict'
const
  fs       = require('fs'),
  padLeft  = function(id) {
    return ("0000" + id).slice(-4) //pad left w/ zeroes
  }


module.exports = function(config, app) {
  app.get(/^\/api\/presentations\/(\w+)\/files(?:\/(.*))?$/, function(req,res) {
    let id = padLeft(req.params[0])
    let path = req.params[1]
    let
      allFiles = [],
      root = config.masterDir + "/" + id
      if (path) {
        root = root + "/" + path
      }

    fs.readdir(root, function(err, files) {
      if (err) {
        res.send(404)
      } else {
        let total = files.length
        files.forEach(function(file) {
          fs.stat(root + "/" + file, function(err, stat) {
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

  })

  app.get("/api/presentations/:id", function(req,res) {
    let
      id = padLeft(req.params.id),
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