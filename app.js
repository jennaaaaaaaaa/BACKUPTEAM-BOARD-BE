const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const cors = require('cors')
const users = require('./DB/user')
const articles = require('./DB/Articles')
const jwt = require('jsonwebtoken')

const app = express()

//토큰 방법
const jwtConfig = {
    secretKey : 'YoUrSeCrEtKeY', // 원하는 시크릿 ㅍ키
    options : {
        algorithm : "HS256", // 해시 알고리즘
        expiresIn : "20m",  // 토큰 유효 기간
        issuer : "gimin" // 발행자
    } //토큰을 만들 때만 필요한 옵션(열쇠를 준것)
}


let corsOptions = {
    origin: 'http://localhost:9001',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.post('/login', (req, res) => {
    
    const email = req.body.email
    const password = req.body.password
    const user = users.find(user => user.email === email && user.password === password)

    if(!user){
        return res.status(404).json({message: '로그인 실패'})
    }

    const token = jwt.sign(user, jwtConfig.secretKey, jwtConfig.options)

    res.cookie('user_token', token)

    res.json({message: '로그인 완료'})
})

app.get('/articles', (req,res) => {
    res.send(articles.splice(0, 10))
})

app.post('/articles', (req,res) => {
    //쿠키에 토큰이 없다면
    if(!req.cookies.user_token){
        return res.json({message: "로그인하세요" })
    }

    const title = req.body.title
    const contents = req.body.contents

    articles.push({title, contents})

    res.json(articles)
})

app.get('/profile', (req, res) => {
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    const user = users.find(user => user.email === verify_user.email)
    
    // res.json(verify_user)
    //verify_user값 찍어보기

    if(!user) {
        return res.json({message:'없는 유저'})
    }

    res.json({user})
})

//게시글 상세조회
app.get('/articles/:id', (req, res) => {
    //:id 에 어떤 값이든 들어갈 수 있다
    const id = req.params.id //1 params는 문자형으로 들어온다
    const post = articles.find(a => a.id === Number(id))

    if(!post) {
        return res.json({message: "없는 게시물입니다" })
    }
   
    res.json(post)
})


//특정 게시물 하나만 수정
app.put('/articles/:id', (req,res) => {
    //특정 게시물 하나만 수정

    //로그인 안한 사람도 수정 버튼이 보이는 데 수정을 누르면 로그인 하라고 뜨는
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    if(!verify_user) {
        return res.json({message: "로그인하세요" })
    }

    const id = req.params.id //1 params는 문자형으로 들어온다
    const post = articles.find(a => a.id === Number(id))

    const user = users.find(user => verify_user.email === user.email )

    if(user.id !== post.user_id) {
        return res.json({message: '본인이 작성한 글만 수정 가능'})
    }

    const title = req.body.title || post.title
    const contents = req.body.contents || post.contents

    post.title = title
    post.contents = contents

    console.log(post)

    res.json({message: '수정 완료'})

})

//게시물 삭제
app.delete('/articles/:id', (req, res) => {
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    if(!verify_user) {
        return res.json({message: "로그인하세요" })
    }

    const article = articles.find(ar => ar.id === Number(req.params.id))
    if (!article) {
        return res.json({message: '본인이 작성한 글만 삭제 가능'})
    }

    const index = articles.indexOf(article)
    //const article에서 찾는 article이 몇번째 인지 index에 넣어줌
    articles.splice(index, 1)
    //index 번째 articles에서 index번째 포함 1개 지운다

    res.json({message:"삭제 완료"})
})




app.listen(7001, () => {
    console.log('7001 server')
})
