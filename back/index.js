const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');

const db = require('../back/models');
const passportConfig = require('./passport');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig(); 

app.use(morgan('dev'));
app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, 
    },
    name: 'rnb'
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);


app.listen(3306, () => {
    console.log(`server is running on port 3306`);
});