const {findOne, findOneById}= require('./db')

const getUserByEmailAndPassword = async (email, password) => {
    return await findOne('users', { email, password })
}

//사용자 정보 하나만 가져오는 api
const getUser = async (id) => {
    return await findOneById("users", id, email) //table, value, key
    
}

module.exports = {
    getUserByEmailAndPassword, 
    getUser,
}