// get the client
const mysql = require('mysql2');

// create the connection to database
//connection 생성 (mysql과 연결 준비)
const connection = mysql.createConnection({
    host: "caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com",
    user: "sparta",
    password: "tmvkfmxk2022",
    database: "sparta_backup",
})
