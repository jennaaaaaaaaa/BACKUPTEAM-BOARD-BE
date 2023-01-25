const express = require('express')
const { login, userinfo, logout, signUp } = require('../controllers/users.controllers')
const router = express.Router()


router.post("/login", login)
router.post("/signup", signUp)
router.get("/profile", userinfo)
router.get("/logout", logout)

module.exports = router


