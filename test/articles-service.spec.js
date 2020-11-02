const ArticleService = require('../src/articles-service.js')
const knex = require('knex')

describe(`Articles service object`, function(){
  let db

  before(() =>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })
  describe(`getAllArticles()`, () =>{
    it(`resolves all articles from 'blogful_articles' table`, () =>{

    })
  })
})
