const express = require('express')
const router = express.Router()
const { tagList } = require('../controllers/tags.controllers')


router.get('/tags', tagList)


module.exports = router