const {emailPasswordCheck, tokenCheck, emailCheck, createUser} = require('../repositories/users.repositories')
const jwt = require("jsonwebtoken")
const {jwtConfig} = require('../conn/config')

// 받아올값 : req.body
// res.json
const login = async (req, res) => {
    const {email, password} = req.body
    const loginCheck = await emailPasswordCheck(email, password)
    
    if(!loginCheck) {
        return res.status(404).json({message: "없음"})
    }

    const token = jwt.sign({id:loginCheck.id}, jwtConfig.secretKey, jwtConfig.options)
    res.cookie('user_token', token)
    res.json({message: "성공"})

}

const userinfo = async (req, res) => {
    if(!req.cookies.user_token){
        return res.json({message: "로그인 안되있음"})
    }
    const tokenUser = jwt.verify(req.cookies.user_token, jwtConfig.secretKey).id
    const userCheck = await tokenCheck(tokenUser)
    if(!userCheck) {
        return res.status(404).json({message: "없음"})
    }
    
    res.json(userCheck)
}

const logout = (req, res) => {
    res.clearCookie('user_token')
    res.end()
}

const signUp = async (req, res) => {
    const {name, email, password, confirm} = req.body
    const user = await emailCheck(email)
    //이메일만 찾아서 체크

    if(user) {
        return res.status(404).json({message: "이미 존재하는 아이디"})
    }
    
    //중복된 아이디가 아니라면 생성
    await createUser(name, email, password, confirm)
    res.json({message: "가입완료"})
}

module.exports = {login, userinfo, logout, signUp}
//repo, model, conn.js = 시퀄
//routing, controller, app = express