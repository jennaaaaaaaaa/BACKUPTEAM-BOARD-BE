//모델을 가져온다
const { Article } = require("../model/articles.model")

// 게시물 목록
//limit/perPage 한 페이지당 게시글 갯수
//startindex 몇번째부터 몇번째까지 게시글을 가져올건지
//["created_at", "DESC"] 최신글순 
const getArticles = async (perPage, startindex) => {
    const { count, rows } = await Article.findAndCountAll({ limit: perPage, offset: startindex, order: [["created_at", "DESC"]] })
    const lastPage = (count % perPage) === 0 ? count / perPage : Math.ceil(count / perPage)
    return [lastPage, rows]
}

//게시글 상세조회
const getAticle = async (id) => {
    const article = await Article.findByPk(id)
    return article
}
//게시글 작성
const createArticle = async (id, title, contents) => {
    const newPost = await Article.create({ user_id: id, title, contents })
    return newPost
}

//게시글 수정
const updateArticle = async (id, title, contents) => {
    const post = await Article.update({title, contents}, {where: {id}})
    return post
}

//게시글 삭제
const deleteArticle = async (id) => {
    const post = await Article.destroy({where: {id}})
    return post //??
}

module.exports = { createArticle, deleteArticle, getAticle, getArticles, updateArticle }