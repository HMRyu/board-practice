const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb')

let db
const url = 'mongodb+srv://admin:1234@cluster0.696llwi.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('board')
}).catch((err)=>{
  console.log(err)
})

app.set('view engine', 'ejs') 

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true})) 

app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/list', async (req, res) => {

    let result = await db.collection('post').find().toArray()

    res.render('list.ejs', {result : result})
})

app.get('/detail/:id', async (req, res) => {

    let result = await db.collection('post').findOne({
        _id : new ObjectId(req.params.id)
    })

    res.render('detail.ejs', {result : result})

})

app.get('/write', async (req, res) => {
    res.render('write.ejs')
})

app.post('/add', async (req, res) => {

    //console.log(req.body)
    await db.collection('post').insertOne({
        title : req.body.title,
        content : req.body.content
    })

    res.redirect('/list')
})

app.get('/edit/:id', async (req, res) => {

    //console.log(req.params)

    let result = await db.collection('post').findOne({_id : new ObjectId(req.params.id)})

    res.render('edit.ejs', {result : result})
})

app.post('/edit', async (req, res) => {
    await db.collection('post').updateOne({
        _id : new ObjectId(req.body.id)
    }, {$set : {
        title : req.body.title,
        content : req.body.content
    }})

    res.redirect('/list')
})

app.delete('/delete', async (req, res) => {
    //console.log(req.query)
    await db.collection('post').deleteOne({
        _id : new ObjectId(req.query.docid)
    })

    res.send('삭제완료')
})