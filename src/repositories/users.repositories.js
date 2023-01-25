//모델에서 가져온다
const { User } = require("../model/user.model")

//db에서 
//로그인에서 email password 받아오기
const emailPasswordCheck = async (email, password) => {
    const user = await User.findOne({ where:  {email: email, password: password}})
    if (!user) {
        console.log('Not found!')
    } 

    return user
}

//가진 email 값이 없음
//payload에 id값
//쿠키 갔다 붙이면 email 나옴
//그래서 id

//이 id값이 그 users에서 자동으로 생성된 id인지
//아니면 payload에서 생성된 id인지
const tokenCheck = async (id) => {
    const user = await User.findByPk(id,  {attributes: ['name', 'email']})//name과 email만 받음
    if (!user) {
      console.log('Not found!')
    } 
    return user
}

//이메일만 찾아서 체크
//회원가입시 중복된 아이디가 있는지 확인하기 위해
const emailCheck = async (email) => {
    const user = await User.findOne({where: {email}})
    if (!user) {
        console.log('Not found!')
    } 
    return user
}

//중복된 아이디가 아니라면 생성
const createUser = async (name, email, password) => {
    const newSign = await User.create({name, email, password})
    return newSign
}

module.exports = {emailPasswordCheck, tokenCheck, emailCheck, createUser}
