
// bad example, but you get the point ;)

// $ npm install redis
// $ redis-server

let path = require('path')
let util = require('util')
let migrate = require('../')
let redis = require('redis')

redis.RedisClient.prototype.rpopAsync = util.promisify(redis.RedisClient.prototype.rpop)
redis.RedisClient.prototype.rpushAsync = util.promisify(redis.RedisClient.prototype.rpush)
redis.RedisClient.prototype.setAsync = util.promisify(redis.RedisClient.prototype.set)

let db = redis.createClient()

migrate(path.join(__dirname, '.migrate'))

migrate('add pets', async function () {
  return Promise.all([
    db.rpushAsync('pets', 'tobi'),
    db.rpushAsync('pets', 'loki')
  ])
}, async function () {
  return Promise.all([
    db.rpopAsync('pets'),
    db.rpopAsync('pets')
  ])
})

migrate('add jane', async function () {
  return db.rpushAsync('pets', 'jane')
}, async function () {
  return db.rpopAsync('pets')
})

migrate('add owners', async function () {
  return Promise.all([
    db.rpushAsync('owners', 'taylor'),
    db.rpushAsync('owners', 'tj')
  ])
}, async function () {
  return Promise.all([
    db.rpopAsync('owners'),
    db.rpopAsync('owners')
  ])
})

migrate('coolest pet', async function () {
  return db.setAsync('pets:coolest', 'tobi')
}, async function () {
  return db.delAsync('pets:coolest')
})

let set = migrate()

console.log()
set.on('save', function () {
  console.log('Saved')
})

set.on('migration', function (migration, direction) {
  console.log(direction, migration.title)
})

async function main () {
  await set.up()
  process.exit()
}

main()
