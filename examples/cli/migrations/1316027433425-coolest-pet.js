
let db = require('./db')

exports.up = async function () {
  await db.setAsync('pets:coolest', 'tobi')
}

exports.down = async function () {
  await db.delAsync('pets:coolest')
}
