const express = require('express')
const cookieParser = require('cookie-parser')
const {jwtConfig, corsOptions} = require('./src/config/configuration')
const jwt = require('jsonwebtoken')
const cors = require('cors')
// const mysql = require('mysql')
const app = express()
const {getUserByEmailAndPassword, getUser, getArticle, getArticles} = require('./src/repositories')


app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

//로그인
app.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    let user

    try {
        user = await getUserByEmailAndPassword(email, password)
    } catch (e) {
        res.status(404).json({message: e.message})
    }

    const token = jwt.sign({email: a.email}, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('user_token', token)
    
    res.json({ message: '로그인 완료' })

    
    // if(!user){
    //     return res.status(404).json({message: '로그인 실패'})
    // }
})

//게시물 목록
// 클라이언트한테 페이지 받기
// 쿼리한데 몇개씩 보여줄지 정해야됨 10
// 위에 두가지를 가지고 시작점이 어딘지
// ?page=1
app.get('/articles', async (req, res) => {

    const { page } = req.query
    const perPage = 5
    const startIndex = ((page || 1) - 1) * perPage
    const currentPage = page || 1

    const articles = await getArticles()
    res.send(articles)

    // const articlesCount = `select count(*) from Gimin_articles_05`
    // connection.query(articlesCount, (error, rows, fields) => {
    //     allPage = rows[0]["count(*)"]
    //     lastPage = (allPage % perPage) === 0 ? allPage / perPage : (allPage / perPage) + 1

    //     // console.log(allPage)
    //     // console.log(lastPage)
    //     // res.send(rows[0])

    //     const articles = `select * from Gimin_articles_05 order by id desc limit ${perPage} offset ${startIndex}`
    //     connection.query(articles, (error, rows, fields) => {
    //         const aboutPage = {
    //             rows,
    //             allPage,
    //             lastPage,
    //             currentPage
    //         }
    //         res.send(aboutPage)
    //     })
    // })    
})

//게시물 작성
app.post('/articles', async (req, res) => {
    //쿠키에 토큰이 없다면
    if (!req.cookies.user_token) {
        return res.json({ message: "로그인하세요" })
    }

    const { title } = req.body
    const { contents } = req.body

    if (!title || !contents) {
        return res.status(401).end()
    }

    // const post = `insert into Gimin_articles_05(title, contents) values( "${title}", "${contents}")`
    // connection.query(post, (error, rows, fields) => {
        // res.json({rows})
         
    // })

    const a = await getTitleAndContents(email, password)

    res.json({rows})
})

//프로필(유저 정보보기)
app.get('/profile', async (req, res) => {
    const verify_user = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    const user = `select * from users where email = "${verify_user.email}"`
    connection.query(user, (error, rows, fields) => {
        if (!rows) {
            return res.json({ message: '없는 유저' })
        }

        res.json({ name: rows[0].name, email: rows[0].email })

    })


    // res.json({ name: rows[0].name, email: rows[0].email })
    // res.json(verify_user.email)
    //verify_user값 찍어보기
})

//게시글 상세조회
app.get('/articles/:id', async (req, res) => {
    //:id 에 어떤 값이든 들어갈 수 있다
    const id = Number(req.params.id) //params는 문자형으로 들어온다
    
    let article = null
    try{
        article = await getArticle(id)
        //getArticle 함수를 호출해서 해당 id의 article를 갖고 와서
        //article에 넣어주겠다

    } catch(e) {
        res.status(404).json({message: e.message})
    }
    res.send(article) //값 넘기기


    // connection.query(post, (error, rows, fields) => {

    //     if (!rows) {
    //         return res.json({ message: "없는 게시물입니다" })
    //     }
    //     res.json(rows[0])
    // })
})

//유저정보 하나만 가져오는 api
app.get('/users/:id', async (req, res) => {
    //:id 에 어떤 값이든 들어갈 수 있다
    const id = Number(req.params.id) //params는 문자형으로 들어온다
    
    let user = null
    try{
        user = await getUser(id)
        //getUser 함수를 호출해서 해당 id의 user 갖고 와서
        //user 넣어주겠다

    } catch(e) {
        res.status(404).json({message: e.message})
    }
    res.send(user)
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

app.get("/logout", (req, res) => {
    res.clearCookie("jwt")
    res.end()
})

app.listen(7001, () => {
    console.log('7001 server')
})