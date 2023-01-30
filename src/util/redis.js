const redis = require('redis')

client.on('connect', err => console.log('connection'))
const client = redis.createClient()
client.connect()

module.exports = client