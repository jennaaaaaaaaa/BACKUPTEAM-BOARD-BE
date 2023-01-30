const a = require("../conn/conn");
const {DataTypes} = require('sequelize');


const User = a.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: DataTypes.DATE,
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});



module.exports = {User}