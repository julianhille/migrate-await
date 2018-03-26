
// bad example, but you get the point ;)

// $ npm install redis
// $ redis-server
let redis = require('redis')
let util = require('util')
let db = redis.createClient()

redis.RedisClient.prototype.rpopAsync = util.promisify(redis.RedisClient.prototype.rpop)
redis.RedisClient.prototype.rpushAsync = util.promisify(redis.RedisClient.prototype.rpush)
redis.RedisClient.prototype.setAsync = util.promisify(redis.RedisClient.prototype.set)
redis.RedisClient.prototype.delAsync = util.promisify(redis.RedisClient.prototype.del)

module.exports = db
