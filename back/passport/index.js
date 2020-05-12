const passport = require('passport');

const db = require('../models');
const local = require('./local');

module.exports = () => {
    passport.serializeUser((user, done) => {
        return done(null, user.id);             //{ id: 1, cookie: 'asdf'}
    });

    passport.deserializeUser( async (id, done) => {
        try{
            const user = await db.User.findOne({
                where: {id}
            })
            return done(null, user); //req.user
        }catch(err){
            console.log(err);
            return done(err);
        }
    });
    local();
};


// just sending cookie from front-end to server (ex: 'asdf')
// server would checked by cookie-parser, express-session and find id
// id=1 is going to deserializeUser' id
// and find user information using database
// and put the information into req.user

// deserializeUser would work everytime you request 
// that means, need to do cashing due to unnecessary using server ocurred, 
