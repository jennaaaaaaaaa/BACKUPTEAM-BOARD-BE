let conn = null
require("./conn")().then(mysqlConn => { //() ./conn 받아와서 함수실행
    conn = mysqlConn
})

const findOne = async (table, conditions) => {
    const conditionString = Object.keys(conditions).map(field => `${field} = ?`).join(" and ")
    const [result] = await conn.execute(`select * from ${table} where ${conditionString}`, Object.values(conditions))

    if (!result.length) {
        throw new Error('Not found User')
    }
    return result[0]
}

//하나의 아이디를 받았을 때 그 아이디를 찾아오는 것
const findOneById = async(table, value, key) => {
    //key를 쓴 이유: 가끔 primarykey가 필드 이름이 아닌 경우
    const pk = key || 'id' //pk에 key를 넣음 key가 없다면 기본값으로 id를 넣어줌
    const [rows] = await conn.execute(`select * from ${table} where ${pk} = ?`, [value])
    //const [article, field]

    if(!rows.length){//article을 가져오지 못 한다면, article length가 없다면
        throw new Error("Not found")
    }

    return rows[0] //여러개 가지고 온거 중에 하나만 가지고 오니까 배열에 무조건 첫번째값

}

//페이징 처리해서 목록으로 가져오는 것도 공통함수로 뺌
// const findMany = async() => {

// }





module.exports = {
    findOne,
    findOneById,
    sql,
}
