const {findOne, findOneById}= require('./db')//findOne은 이 파일에서 사용하지 않고 있음

const getArticles = async (page, perPage, startIndex) => {
    const [articlesCount] = await conn.execute(`select count(*) from Gimin_articles_05`)

    const articles = await conn.execute(`select * from Gimin_articles_05 order by id desc limit ${perPage} offset ${startIndex}`)
    const lastPage = Math.ceil(articlesCount[0].count / perPage)
    const currentPage = page || 1

    return {
        aboutPage : {
            allPage,
            lastPage,
            currentPage
        },
        articles

    }
}

//id만 하나 받아서 article을 가져오면 됨
//게시글 하나 가져오는 api 
const getArticle = async (id) => {
    const [article] = await conn.execute(`select * from Gimin_articles_05 where id = ?`, [id])
    if (!article.length) {
        throw new Error("Not found")
    }
    return article[0]
    
}

module.exports = {
    getArticles,
    getArticle,
}