const { Sequelize, DataTypes} = require('sequelize');
const {User} = require('./user.model')

const sequelize = new Sequelize('sparta_backup', 'sparta', 'tmvkfmxk2022', {
    host: 'caredog-test.c0o6spnernvu.ap-northeast-2.rds.amazonaws.com',
    dialect: 'mysql'
});

const Article = sequelize.define('articles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: DataTypes.STRING,
    contents: DataTypes.STRING,
    count: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

Article.User = Article.belongsTo(User, {foreignKey: 'user_id'})
//user require 잘
//아티클이 user와 연결되어있는키
//아티클이 유저에 속한다 user_id로?
//아티클을 가져오면서 아티클 작성한 사람의 정보까지 가져오게끔

User.Article = User.hasMany(Article, {foreignKey : 'user_id'})
//user가 가지고 있는 아티클들을 가져오기 위해서
//profile에 게시글들을 보이게 할 수 있다



module.exports = {Article} 