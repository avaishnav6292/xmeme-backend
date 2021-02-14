const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const serverless = require('serverless-http');

const db = knex({
    client: 'sqlite3',
    connection: {
      filename: "./memes.sqlite"
    },
    useNullAsDefault: true
  });

const port = process.env.PORT || 8081;

// db.schema.hasTable('memes')
//   .then((exist) => {
//       if (!exist) {
//           db.schema.createTable('memes', (table) => {
//               table.increments('id');
//               table.text('name');
//               table.text('caption');
//               table.text('url');
//           })
//               .then(() => {
//                   console.log('Database created.');
//               })
//       } else {
//           console.log('Database already exists.')
//       }
//   })
//   .catch(err => console.log(err));


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res)=> {
    res.send("Welcome to XMeme.");
})

app.get('/memes', (req, res)=> {
    db.select('*').from('memes').orderBy('id', 'desc').limit('100')
    .then(data => {
        return res.status(200).json(data).end();
    })
    .catch(() => {
        return res.status(404).end();
    })
})

app.post('/memes', (req, res)=> {
    const { name, caption, url } = req.body;
    db('memes').insert({
        name: name,
        caption: caption,
        url: url
    })
    .then(id => { return res.status(200).json({'id': id[0]}).end();})
    .catch(() => { return res.status(404).end(); })
})

app.get('/memes/:id', (req, res)=> {
    const { id } = req.params; 
    console.log(id);

    db('memes').select('*').from('memes').where({id:id})
    .then(data => {
        return res.status(200).json(data[0]).end();
    })
    .catch(() => {
        return res.status(404).end();
    })
})

app.patch('/memes/:id', (req, res)=> {
    const {id} = req.params;
    const { caption, url } = req.body;
    db('memes')
  .where('id', id)
  .update({
    caption: caption,
    url: url
  })
  .then(id => { return res.status(200).json(data[0]).end();})
    .catch(() => { return res.status(404).end(); })
})

app.delete('/memes/:id', (req,res)=>{
    const {id} = req.params;
    db('memes')
        .where('id','=', id)
        .del()
        .then(id => { return res.render('/memes').json({'id': id[0]}).end();})
    .catch(() => { return res.status(404).end(); })

})


app.listen(port, ()=> {
    console.log(`XMeme Server is running on ${port}`);
});

module.exports.handler = serverless(app);
