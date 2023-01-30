const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const userRouter = require('./src/routings/users.router')
const articleRouter = require('./src/routings/articles.router')
const tagRouter = require('./src/routings/tags.router')
const {corsOptions} = require('./src/conn/config')

app.use(cors(corsOptions))
app.use(express.json()) 
//body에 보내는 값이 text인데 그걸 json 파서 같은 걸 통해서 object로 바꿔준다
//그걸 req.body에 넣는 기능
//모든 바디로 들어오는 데이터를 오브젝트로 받을 수 있게 하는 

app.use(cookieParser())
//외계어 같은 쿠키 key =value들을 오브젝트로 만들어주는 기능

app.use('/', userRouter)
app.use('/', articleRouter)
app.use('/', tagRouter)

// app.use(function(err, req, res) {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// }); //위 어떤 라우터가 실행되도 적용??


app.listen(7001, () => {
    console.log('7001 server')
})

//repo에서 만든 기능을 controll에서 받고 controll에서 만든 기능을
//router로 받고 router
