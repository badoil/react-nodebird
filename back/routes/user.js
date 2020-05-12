const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const db = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middleware');

router.get('/', isLoggedIn, (req, res) => {
    const user = Object.assign({}, req.user.toJSON());
    delete user.password;
    return res.json(user);
});

// router.get('/', isLoggedIn, async (req, res, next) => {
//     try{
//         const me = await db.User.findOne({
//             where: { id: req.user.id},
//             include: [{
//                 model: db.Post,
//                 as: 'Posts',
//                 attributes: ['id'],
//             }, {
//                 model: db.User,
//                 as: 'Followings',
//                 attributes: ['id'],
//             }, {
//                 model: db.User,
//                 as: 'Followers',
//                 attributes: ['id'],
//             }],
//             attributes: ['id', 'nickname'],
//         })
//         return res.json(me);
//     }catch(e){
//         console.error(e);
//         next(e);
//     }
// })

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try{
        const exUser = await db.User.findOne({
            where: {
                userId: req.body.userId,
            }
        })
        if(exUser){
            return res.status(403).send('duplicated user');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = await db.User.create({
            userId: req.body.userId,
            nickname: req.body.nickname,
            password: hashedPassword,
        })
        return res.status(200).json(newUser);
    }catch(err){
        console.log(err);
        return next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try{
        const otherUser = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) },
            include: [{
                model: db.Post,
                as: 'Posts',
                attributes: ['id'],
            }, {
                model: db.User,
                as: 'Followers',
                attributes: [ 'id' ],
            }, {
                model: db.User,
                as: 'Followings',
                attributes: [ 'id' ],
            }],
            attributes: [ 'id', 'nickname' ],
        })
        const jsonUser = otherUser.toJSON();
        jsonUser.Posts = jsonUser.Posts? jsonUser.Posts.length: 0;
        jsonUser.Followers = jsonUser.Followers? jsonUser.Followers.length: 0;
        jsonUser.Followings = jsonUser.Followings? jsonUser.Followings.length: 0;
    }catch(err){
        console.error(err);
        return next(err);
    }
    
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error(err);
            return next(err);
        }
        if(info){
            return res.status(401).send(info.reason);
        }
        return req.login(user, async (loginErr) => {
            try{
                if(loginErr){
                    return next(loginErr);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id},
                    include: [{
                        model: db.Post,
                        as: 'Posts',
                        attributes: ['id'],
                    },{
                        model: db.User,
                        as: 'Followers',
                        attributes: ['id'],
                    }, {
                        model: db.User,
                        as: 'Followings',
                        attributes: ['id'],
                    }],
                    attributes: ['id', 'nickname', 'userId'],
                })
                const jsonUser = fullUser.toJSON();
                // jsonUser.Posts = jsonUser.Posts? jsonUser.Posts.length: 0;
                // jsonUser.Followers = jsonUser.Followers? jsonUser.Followers.length: 0;
                // jsonUser.Followings = jsonUser.Followings? jsonUser.Followings.length: 0;
                return res.json(jsonUser);
            }catch(err){
                console.err(err);
                return next(err);
            }
            
        });
    })(req, res, next)
});

router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('log out!!')
});

router.get('/:id/followings', isLoggedIn, async(req, res, next) => {
    try{
        const me = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) || req.user && req.user.id},
        })
        const followings = await me.getFollowings({
            attributes: ['id', 'nickname'],
            offset: parseInt(req.query.offset, 10),
            limit: parseInt(req.query.limit, 10),
        })
        return res.json(followings);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

router.get('/:id/followers', isLoggedIn, async(req, res, next) => {
    try{
        const me = await db.User.findOne({
            where: { id: parseInt(req.params.id, 10) || req.user && req.user.id},
        })
        const followers =  await me.getFollowers({
            attributes: ['id', 'nickname'],
            offset: parseInt(req.query.offset, 10),
            limit: parseInt(req.query.limit, 10),
        })
        return res.json(followers);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

router.delete('/:id/follower', isLoggedIn, async (req, res, next) => {
    try{
        const me = await db.User.findOne({
            where: { id: req.user.id }
        })
        await me.removeFollower(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        return next(e);
    }
})

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        const me = await db.User.findOne({
            where : { id : req.user.id },
        })
        await me.addFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        console.log('req.user.id:', req.user.id)
        console.log('req.params.id', req.params.id);
        const me = await db.User.findOne({
            where: { id: req.user.id },
        })
        await me.removeFollowing(req.params.id);
        res.send(req.params.id);
    }catch(e){
        console.error(e);
        next(e);
    }
});

router.get('/:id/posts', async (req, res, next) => {
    try{
      const posts = await db.Post.findAll({
        where: { 
            UserId: parseInt(req.params.id, 10) || req.user && req.user.id,
            RetweetId: null,
        },
        include: [{
          model: db.User,
          attributes: ['id', 'nickname']
        }, {
            model: db.Image,
        }, {
            model: db.User,
            through: 'Like', 
            as: 'Likers',
            attributes: ['id'],
        }],
      })
      return res.json(posts);
    }catch(e){
      console.error(e);
      return next(e);
    }
  })

  router.patch('/nickname', isLoggedIn, async(req, res, next) => {
      try{
        await db.User.update({
            nickname: req.body.nickname,
        }, {
            where: { id: req.user.id },
        })
        res.send(req.body.nickname);
      }catch(e){
          console.error(e);
          next(e);
      }
  })



module.exports = router;