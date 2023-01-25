const express = require('express')
const router = express.Router()
const { postWrite, postList, postDetail, postModify, postDelete } = require('../controllers/articles.controllers')

router.post('/write', postWrite)
router.get('/list', postList)
router.get('/:id', postDetail)
router.patch('/:id', postModify)
router.delete('/:id', postDelete)

module.exports = router