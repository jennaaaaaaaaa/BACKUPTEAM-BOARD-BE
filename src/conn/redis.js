const redis = require('redis')

const client = redis.createClient()

client.on('error', err => console.log('Redis Client Error', err))
client.on('connect', err => console.log('connection'))

(async () => {
    await client.connect()//app 띄울때 connection
    console.log("connnect")
    // await client.set('key', 'value')
    const value = await client.get('a')
    console.log(value)
    await client.disconnect()
})()


