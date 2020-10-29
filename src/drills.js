require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

const searchTerm = 'hi';

console.log(process.env.PORT)

// knexInstance
//   .select('id','name','price','category','checked')
//   .from('shopping_list')
//   .where({ name: 'Not Dogs'})
//   .then(results=>{
//     console.log(results)
//   })

const searchByName = (searchTerm) =>{
  knexInstance
    .select('id','name','price','category','checked')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result =>{
      console.log(result)
    })
}
searchByName(searchTerm)

const paginateProducts = (pageNumber) =>{
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber-1)
  knexInstance
    .select('id','name','price','category','checked')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result =>{
      console.log(result)
    })

}
paginateProducts(2)

const itemsAfterDate = (daysAgo) =>{
  knexInstance
    .select('id','name','price','category','checked')
    .from('shopping_list')
    .where('date_added', '>',
    knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo))

    .then(result =>{
      console.log(result)
    })
}
itemsAfterDate(5)

const totalCostPerCategory = () =>{
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result =>{
      console.log(result)
    })

}

totalCostPerCategory()
console.log('knex and driver installed correctly')
