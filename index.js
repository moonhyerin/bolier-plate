const express = require('express')
const app = express()
const port = 5000

//몽고DB 연결
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hrmun:hrmun1234!@testmongodb.yh2ks.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => console.log('연결됨')).catch(err => console.log(err))

//DB 스키마 생성

app.get('/', (req, res) => res.send('Hello World'))

app.listen(port, () => console.log(`Example app listening on port ${port}`))

//mongodb+srv://hrmun:<password>@testmongodb.yh2ks.mongodb.net/<dbname>?retryWrites=true&w=majority
