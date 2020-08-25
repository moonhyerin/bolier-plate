const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./models/User')

const config = require('./config/key')

//bodyParser가 클라이언트에서 오는 정보를 서버에서 분석할 수 있게 해주는 역할
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());

//몽고DB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
}).then(() => console.log('연결됨')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World, I am Hyerin'))

app.post('/register', (req, res) => {
    //클라이언트에서 보내는 회원 정보를 받아서 처리하는 callback function
    //회원 정보를 데이터베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });

        return res.status(200).json({
            success: true
        });
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`))

//mongodb+srv://hrmun:<password>@testmongodb.yh2ks.mongodb.net/<dbname>?retryWrites=true&w=majority
