const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const users = require('./DB/user')
const articles = require('./DB/Articles')

const app = express()

//no 이해
let corsOptions = {
    origin: 'http://localhost:9001',
    credentials: true
  }
  
  
app.use(cors(corsOptions))

app.use(express.json())
app.use(cookieParser())

app.get('/articles', (req,res) => {
    res.send(articles.splice(0, 10))
})

app.get('/users', (req,res) => {
    const userId = req.cookies.user_email

    const user = users.find( user => user.email === userId)
    // cookie user_email과 user email이 같으면 페이지에 찍어준다

    res.send("users")
})

app.get('/profile', (req,res) => {

    //이 부분이 쿠키값 여부에 값 리스폰
    const id = req.cookies.user_email 
    //user email 값이 id 다
    //썬더클라이언트에서 cookie 직접 확인해보기
    //확인 방법: /login에서 body값 post send 후 cookie 확인
    
    const user = users.find(user => user.email === id)
    console.log(user)
    res.json(user)
    //json 형태로 user값을 리스폰하겠다
})

app.post('/login', (req,res) => {
    const email = req.body.email //body에 내가 입력한 email
    const password = req.body.password

    const user = users.find( user => user.email === email && user.password === password)

    res.cookie('user_email', user.email) //쿠키 생겼는지 페이지에서 확인

    res.send(user)
})

app.listen(7001, () => {
    console.log('server')
})



