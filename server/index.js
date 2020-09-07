const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

const config = require('./config/key')

//bodyParser가 클라이언트에서 오는 정보를 서버에서 분석할 수 있게 해주는 역할
//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

//몽고DB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB 연결됨')).catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World, I am Hyerin'))

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요~')
})

app.post('/api/users/register', (req, res) => {
    //클라이언트에서 보내는 회원 정보를 받아서 처리하는 callback function
    //회원 정보를 데이터베이스에 넣어준다.
    console.log(req.body);
    const user = new User(req.body);

    //DB에 save
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err });

        return res.status(200).json({
            success: true
        });
    })
})

app.post('/api/users/login', (req, res) => {
    //1. 요청된 이메일을 데이터베이스에 있는지 찾는다
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        //2. 유저가 있다면, 비밀번호 일치 여부를 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) 
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다" });

            //3. 비밀번호 일치 시 토큰 생설
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다 => 쿠키, 로컬 스토리지 등 다양한 곳에 저장할 수 있음
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    })
})


//인증 관련 기능
//role 1 어드민 2 특정 부서 어드민
//role 0 일반유저 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication == true 라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if(err) return res.json({ success: false, err });

        return res.status(200).send({
            success: true
        })        
    });

})


const port = 5000
app.listen(port, () => console.log(`Example app listening on port ${port}`))

//mongodb+srv://hrmun:<password>@testmongodb.yh2ks.mongodb.net/<dbname>?retryWrites=true&w=majority
