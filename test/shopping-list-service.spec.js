const ShoppingListService = require('../src/shopping-list-service.js')
const knex = require('knex')

describe(`SHopping list service object`, () =>{
  let db
  let testItems = [
    { id: 1,
      name:'Butter',
      price: "2.99",
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast'
    },
    { id: 2,
      name:'Milk',
      price: "3.99",
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      checked: false,
      category: 'Breakfast'
    },
    { id: 3,
      name:'Eggs',
      price: "1.99",
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      checked: true,
      category: 'Breakfast'
    },

  ]

  before(() =>{
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })
  before(() => db('shopping_list').truncate())

afterEach(() => db('shopping_list').truncate())

   after(()=> db.destroy())


context(`Given 'shopping-list' has data`, () =>{
  beforeEach(() => {
    return db
      .into('shopping_list')
      .insert(testItems)
  })
  it(`getAllItems() resolves all articles from 'shopping_list' table`, () =>{
      return ShoppingListService.getAllItems(db)
        .then(actual =>{
          expect(actual).to.eql(testItems)
        })
  })
  it(`getById() resolves an article by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testItems[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            name:thirdTestItem.name,
            price: thirdTestItem.price,
            date_added:thirdTestItem.date_added,
            checked: thirdTestItem.checked,
            category: thirdTestItem.category
          })
        })
    })
    it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
       const itemId = 3
       return ShoppingListService.deleteItem(db, itemId)
         .then(() => ShoppingListService.getAllItems(db))
         .then(allItems => {
           // copy the test articles array without the "deleted" article
           const expected = testItems.filter(item => item.id !== itemId)
           expect(allItems).to.eql(expected)
         })
     })
     it(`updateItem() updates an article from the 'shopping_list' table`, () => {
       const idOfItemToUpdate = 3
       const newItemData = {
         name: 'updated name',
         price: '8.00',
         date_added: new Date(),
         category: 'Lunch',
         checked:true,
       }
       return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
         .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
         .then(item => {
           expect(item).to.eql({
             id: idOfItemToUpdate,
             ...newItemData,
           })
         })
     })
})

context(`Given 'shopping_list' has no data`, () => {
   it(`getAllItems() resolves an empty array`, () => {
     return ShoppingListService.getAllItems(db)
       .then(actual => {
         expect(actual).to.eql([])
       })
   })
 })
 it(`insertItem() inserts a new Item and resolves the new article with an 'id'`, () =>{
   const newItem = {
     name: 'Test updated name',
     price: '8.00',
     date_added: new Date(),
     category: 'Lunch',
     checked:true,
   }
  return( ShoppingListService).insertItem(db, newItem)
  .then(actual => {
      expect(actual).to.eql({
        id: 1,
        name:newItem.name,
        price: newItem.price,
        date_added:newItem.date_added,
        checked: newItem.checked,
        category: newItem.category
      })
    })
 })
})
