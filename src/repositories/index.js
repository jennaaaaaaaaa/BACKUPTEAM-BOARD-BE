const user = require('./user')
const articles = require('./article')


module.exports = {
    ...user,
    ...articles,
}