const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const userRouter = require('./src/routings/users.router')
const articleRouter = require('./src/routings/articles.router')
const {corsOptions} = require('./src/conn/config')

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use('/', userRouter)
app.use('/', articleRouter)

app.listen(7001, () => {
    console.log('7001 server')
})

//repo에서 만든 기능을 controll에서 받고 controll에서 만든 기능을
//router로 받고 router
