let fs = require('fs')
let path = require('path')
let rimraf = require('rimraf')

let DB_PATH = path.join(__dirname, 'test.db')

function init () {
  exports.pets = []
  exports.issue33 = []
  exports.numbers = []
}

function nuke () {
  init()
  rimraf.sync(DB_PATH)
}

function load () {
  let c
  try {
    c = fs.readFileSync(DB_PATH, 'utf8')
  } catch (e) {
    return
  }
  let j = JSON.parse(c)
  Object.keys(j).forEach(function (k) {
    exports[k] = j[k]
  })
}

function persist () {
  fs.writeFileSync(DB_PATH, JSON.stringify(exports))
}

exports.nuke = nuke
exports.persist = persist
exports.load = load

init()
