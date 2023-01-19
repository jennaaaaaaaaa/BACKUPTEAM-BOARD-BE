const jwt = require('jsonwebtoken')
const cors = require('cors')

function jwt() {
    const jwtConfig = {
        secretKey: 'YoUrSeCrEtKeY', // 원하는 시크릿 ㅍ키
        options: {
            algorithm: "HS256", // 해시 알고리즘
            expiresIn: "30m",  // 토큰 유효 기간
            issuer: "gimin" // 발행자
        } //토큰을 만들 때만 필요한 옵션(열쇠를 준것)
    }
}

function cors() {
    let corsOptions = {
        origin: 'http://localhost:9001',
        credentials: true
    }
}

module.exports.jwtg = jwt
module.exports.cors = cors
