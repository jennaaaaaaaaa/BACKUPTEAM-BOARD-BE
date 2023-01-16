const express = require('express')
const cookieParser = require('cookie-parser')
// const session = require('express-session')
const cors = require('cors')
// const users = require('./DB/user')
// const articles = require('./DB/Articles')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const app = express()

//토큰 방법
const jwtConfig = {
    secretKey: 'YoUrSeCrEtKeY', // 원하는 시크릿 ㅍ키
    options: {
        algorithm: "HS256", // 해시 알고리즘
        expiresIn: "30m",  // 토큰 유효 기간
        issuer: "gimin" // 발행자
    } //토큰을 만들 때만 필요한 옵션(열쇠를 준것)
}


let corsOptions = {
    origin: 'http://localhost:9001',
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


//connection 생성 (mysql과 연결 준비)
const connection = mysql.createConnection({
    host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
    user: "sparta",
    password: "tmvkfmxk2022",
    database: "sparta_backup",
})

//연결
connection.connect()
// console.log(connection)

// database에 있는 articles정보 가져오기
// connection.query("select * from articles", (error, rows, fields) => {
//     console.log(rows)
// })

//로그인
app.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // const user = users.find(user => user.email === email && user.password === password)
    const user = `select * from users where email = "${email}" && password = "${password}"`
    connection.query(user, (error, rows, fields) => {

        console.log(rows[0])

        //rows[0]은 시퀄문 조건에서 가져온 값을 변수 user에 넣은 값(req.body.email...)
        //rows는 [{..}] 객체가 들어있는 배열이라서 body에 없는 객체 값을 찍으면 빈 배열값이 찍힘
        //빈배열도 값이라고 생각해서 true가 되 로그인 실패가 안뜸
        //그래서 rows[0]으로 객체를 확실하게 찍어줘야함
        //그러면 아무것도 안나와서 rows[0]은 false가 됨

        if (!rows[0]) {
            return res.status(404).end({ })
        }

        // const token = jwt.sign(user, jwtConfig.secretKey, jwtConfig.options)
        const token = jwt.sign({ email: rows[0].email }, jwtConfig.secretKey, jwtConfig.options)
        res.cookie('user_token', token)
        res.send(rows[0])

        // res.json({ message: '로그인 완료' })

    })
    // if(!user){
    //     return res.status(404).json({message: '로그인 실패'})
    // }
})

//게시물 목록
// 클라이언트한테 페이지 받기
// 쿼리한데 몇개씩 보여줄지 정해야됨 10
// 위에 두가지를 가지고 시작점이 어딘지
// ?page=1
app.get('/articles', (req, res) => {

    const { page } = req.query
    const perPage = 5
    const startIndex = ((page || 1) - 1) * perPage
    //1page면 index0부터 정보 가져옴
    //2page면 index10부터...
    const currentPage = page || 1

    const articlesCount = `select count(*) from Gimin_articles_05`
    connection.query(articlesCount, (error, rows, fields) => {
        allPage = rows[0]["count(*)"]
        lastPage = (allPage % perPage) === 0 ? allPage / perPage : (allPage / perPage) + 1

        // console.log(allPage)
        // console.log(lastPage)
        // res.send(rows[0])

        const articles = `select * from Gimin_articles_05 order by id desc limit ${perPage} offset ${startIndex}`
        connection.query(articles, (error, rows, fields) => {
            const aboutPage = {
                rows,
                allPage,
                lastPage,
                currentPage
            } 
            res.send(aboutPage)
        })
    })
})

//게시물 작성
app.post('/articles', (req, res) => {
    //쿠키에 토큰이 없다면
    if (!req.cookies.user_token) {
        return res.json({ message: "로그인하세요" })
    }

    const title = req.body.title
    const contents = req.body.contents
    const post = `insert into Gimin_articles_05(title, contents) values( ${title}, ${contents})`
    connection.query(post, (error, rows, fields) => {
        // res.status(200).send(rows[0])
        // res.send(rows)

        res.json({ title, contents }) //이거를 저장해서...어떻게 목록에 띄우지??
    })
    // res.json({message: '작성 완료'})
    // articles.push({title, contents})
})

//프로필(유저 정보보기)
app.get('/profile', (req, res) => {
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    // const user = users.find(user => user.email === verify_user.email)
    const user = `select * from users where email = "${verify_user.email}"`
    connection.query(user, (error, rows, fields) => {
        if (!rows) {
            return res.json({ message: '없는 유저' })
        }

        res.json({ name: rows[0].name, email: rows[0].email })

    })
    // res.json(verify_user.email)
    //verify_user값 찍어보기
})

//게시글 상세조회
//게시글이 하나만 나오지 않는 상태
app.get('/articles/:id', (req, res) => {
    //:id 에 어떤 값이든 들어갈 수 있다
    const id = Number(req.params.id) //1 params는 문자형으로 들어온다
    // const post = articles.find(a => a.id === Number(id))
    const post = `select * from Gimin_articles_05 where id = "${id}"`
    connection.query(post, (error, rows, fields) => {

        if (!rows) {
            return res.json({ message: "없는 게시물입니다" })
        }
        console.log(rows)

        res.json(rows[0])

    })
})


//특정 게시물 하나만 수정
app.put('/articles/:id', (req, res) => {
    //특정 게시물 하나만 수정s

    //로그인 안한 사람도 수정 버튼이 보이는 데 수정을 누르면 로그인 하라고 뜨는
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    if (!verify_user) {
        return res.json({ message: "로그인하세요" })
    }

    const id = Number(req.params.id)

    const post = `select * from Gimin_articles_05 where id = ${id}`

    connection.query(post, (error, rows, fields) => {
        const title = req.body.title || rows[0].title
        const contents = req.body.contents || rows[0].contents
        connection.query(`update Gimin_articles_05 set title = "${title}", contents = "${contents}" where id = ${id}`, (error, rows, fields) => {
            res.json({ rows })
        })

    })

})

// const id = req.params.id //1 params는 문자형으로 들어온다
// const post = articles.find(a => a.id === Number(id))
// const user = users.find(user => verify_user.email === user.email )

//     if(user.id !== post.user_id) {
//         return res.json({message: '본인이 작성한 글만 수정 가능'})
//     }

//     const title = req.body.title || post.title
//     const contents = req.body.contents || post.contents

//     post.title = title
//     post.contents = contents

//     console.log(post)

//     res.json({message: '수정 완료'})

// })

//게시물 삭제
app.delete('/articles/:id', (req, res) => {
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    if (!verify_user) {
        return res.json({ message: "로그인하세요" })
    }

    const { id } = req.params
    const article = `delete from Gimin_articles_05 where id = ${id}`
    connection.query(article, (error, rows, fields) => {
        res.json({ message: "삭제 완료" })
    })
})

// const article = articles.find(ar => ar.id === Number(req.params.id))
// if (!article) {
//     return res.json({message: '본인이 작성한 글만 삭제 가능'})
// }

// const index = articles.indexOf(article)
// //const article에서 찾는 article이 몇번째 인지 index에 넣어줌
// articles.splice(index, 1)
// //index 번째 articles에서 index번째 포함 1개 지운다

app.get("/logout", (req,res) => {
    res.clearCookie("jwt")
    res.end()
})


app.listen(7001, () => {
    console.log('7001 server')
})
