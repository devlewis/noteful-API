// const NotefulService = require("../src/noteful-service");
// const knex = require("knex");

// describe(`Noteful service object`, function() {
//   let db;
//   let testNotes = [
//     {
//       id: 1,
//       title: "First test post!",
//       content:
//         "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?",
//       date_created: new Date("2029-01-22T16:28:32.615Z"),
//       folder_id:
//     },

//     {
//       id: 2,
//       title: "Second test post!",
//       content:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.",
//       date_created: new Date("2029-01-22T16:28:32.615Z")
//     },
//     {
//       id: 3,
//       title: "Third test post!",
//       content:
//         "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.",
//       date_created: new Date("2029-01-22T16:28:32.615Z")
//     }
//   ];

//   before(() => {
//     db = knex({
//       client: "pg",
//       connection: process.env.TEST_DB_URL
//     });
//   });

//   before(() => db("notes").truncate());

//   before(() => {
//     return db.into("notes").insert(testNotes);
//   });

//   after(() => db.destroy());

//   describe(`getAllNotes()`, () => {
//     it(`resolves all notes from 'noteful' table`, () => {
//       return NotefulService.getAllNotes(db).then(actual => {
//         expect(actual).to.eql(testNotes);
//       });
//     });
//   });
// });
