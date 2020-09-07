const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     //trim : 스페이스(빈 공간) 을 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

//pre : mongoDB의 메소드로, 특정 행동(매개변수)을 하기 '전'에 실행 될 기능을 지정할 수 있다
userSchema.pre('save', function (next) {
    var user = this;    //user 스키마 정보를 가져옴

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                user.password = hash;   //plain password를 hash된 password로 교체
                next()
            })
        })
    } else {
        //비밀번호가 아닌 다른 정보를 바꿀 때는 바로 next()를 통해 pre 메소드에서 빠져나가게 해준다.
        next()
    }
})

//내가 메소드를 만들 수도 있다!
userSchema.methods.comparePassword = function (plainPassword, callback) {

    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callback(err)

        callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function (callback) {
    var user = this;

    //매개 변수 두 개를 합쳐서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    

    user.token = token;
    user.save((err, user) => {
        if(err) return callback(err);

        callback(null, user);
    })
}

userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    //토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return callback(err);

            callback(null, user);
        })
    }) 
}

const User = mongoose.model('User', userSchema);

module.exports = { User };