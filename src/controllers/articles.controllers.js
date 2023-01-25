const { jwtConfig } = require('../conn/config')
const jwt = require("jsonwebtoken")
const { createArticle, deleteArticle, getAticle, getArticles, updateArticle } = require('../repositories/articles.repositories')



//게시글 목록조회
const postList = async (req, res) => {
    const { page } = req.query
    const perPage = 10
    const startindex = ((page || 1) - 1) * perPage

    const [lastPage, articles] = await getArticles(perPage, startindex)

    res.json({ aboutpage: { perPage, lastPage, currentPage: page || 1 }, articles })

}

//게시글 상세조회
const postDetail = async (req, res) => {
    const { id } = req.params

    const article = await getAticle(id)
    if (!article) {
        return res.status(404).json({ message: "게시글 없음" })
    }

    res.json(article)
}

//게시글 작성
const postWrite = async (req, res) => {
    if (!req.cookies.user_token) {
        return res.json({ message: "로그인 하세요" })
    }

    const id = jwt.verify(req.cookies.user_token, jwtConfig.secretKey).id
    const { title, contents } = req.body
    const postArticle = await createArticle(id, title, contents)

    if (!title || !contents) {
        return res.json({ message: "다시 작성해주세요" })
    }

    res.json(postArticle)
}

//게시글 수정
const postModify = async (req, res) => {

    if (!req.cookies.user_token) {
        return res.json({ message: "로그인 하세요" })
    }

    // console.log(req.cookies.user_token, "이라는 미친 영+숫자를")
    // console.log(jwt.verify(req.cookies.user_token, jwtConfig.secretKey), "해독하면 이렇게 나오는데!")
    // console.log(jwt.verify(req.cookies.user_token, jwtConfig.secretKey).id, "이런식이나")
    // const { id } = jwt.verify(req.cookies.user_token, jwtConfig.secretKey)
    // console.log(id, "이런식으로 활용가능하다")

    const id = Number(req.params.id)

    const article = await getAticle(id)

    if (jwt.verify(req.cookies.user_token, jwtConfig.secretKey).id !== article.user_id) {
        return res.json({ message: "본인 아님" })
    }

    const title = req.body.title || article.title
    const contents = req.body.contents || article.contents

    await updateArticle(id, title, contents)

    res.json({ message: "수정 완료" })

}

//게시글 삭제
const postDelete = async (req, res) => {
    if (!req.cookies.user_token) {
        return res.json({ message: "로그인 하세요" })
    }

    const { id } = req.params

    const article = await getAticle(id)

    if (jwt.verify(req.cookies.user_token, jwtConfig.secretKey).id !== article.user_id) {
        return res.json({ message: "본인 아님" })
    }

    await deleteArticle(article.id)

    res.json({message : "삭제 완료"})
}

module.exports = { postWrite, postList, postDetail, postModify, postDelete }

