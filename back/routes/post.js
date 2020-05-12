const express = require('express');
const db = require('../models');
const multer = require('multer');
const path = require('path');

const { isLoggedIn } = require('./middleware');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, basename + new Date().valueOf() + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
})

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
    try {
      const hashtags = req.body.content.match(/#[^\s]+/g);  // picking up hashtags
      const newPost = await db.Post.create({
        content: req.body.content, // ex) '제로초 파이팅 #구독 #좋아요 눌러주세요'
        UserId: req.user.id, 
      });
      if (hashtags) {
        const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
          where: { name: tag.slice(1).toLowerCase() },
        })));
        await newPost.addHashtags(result.map(r => r[0]));
      }
      console.log('req.body.image:', req.body.image);
      if(req.body.image){
        if(Array.isArray(req.body.image)){
          const images = await Promise.all(req.body.image.map((image) => {
            return db.Image.create({ src: image })
          }))
          await newPost.addImages(images);
        }else{
          const image = await db.Image.create({ src: req.body.image })
          await newPost.addImage(image);
        }
      }
      // const User = await newPost.getUser();
      // newPost.User = User;
      // res.json(newPost);
      const fullPost = await db.Post.findOne({
        where: { id: newPost.id },
        include: [{
          model: db.User,
        },{
          model: db.Image,
        }],
      });
      res.json(fullPost);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  router.get('/:id/comments', async (req, res, next) => {
    try{
      const post = await db.Post.findOne({
        where: {id: req.params.id}
      })
      if(!post){
        return res.status(404).send('No post');
      }
      const comments = await db.Comment.findAll({
        where: { PostId: req.params.id },
        include: [{
          model: db.User,
          attibutes: ['id', 'nickname'],
        }]
      })
      return res.status(200).json(comments);
    }catch(e){
      console.error(e);
      return next(e);
    }
  })

  router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
    try{
      const post = await db.Post.findOne({
        where: { id: req.params.id }
      })
      if(!post){
        return res.status(404).send('No Post');
      }
      const newComment = await db.Comment.create({
        UserId: req.user.id,
        PostId: post.id,
        content: req.body.content,
      })
      await post.addComment(newComment.id);
      const comment = await db.Comment.findOne({
        where: { id: newComment.id},
        include: [{
          model: db.User,
          attibutes: ['id', 'nickname'],
        }]
      })
      return res.status(200).json(comment);
    }catch(e){
      console.error(e);
      next(e);
    }
  })

router.post('/images', upload.array('image'), (req, res) => {
  console.log('req.files:', req.files);
  res.json(req.files.map(v => v.filename))
})

router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try{
    const post = await db.Post.findOne({ where: { id: req.params.id }});
    if(!post){
      return res.status(404).send('No post!!');
    }
    await post.addLiker(req.user.id);
    return res.json(req.user.id);
  }catch(e){
    console.error(e);
    next(e);
  }
})

router.delete('/:id/like', isLoggedIn, async(req, res, next) => {
  try{
    const post = await db.Post.findOne({where: { id: req.params.id }});
    if(!post){
      return res.status(404).send('No Post');
    }
    await post.removeLiker(req.user.id);
    return res.json(req.user.id);
  }catch(e){
    console.error(e);
    next(e);
  }
})

router.post('/:id/retweet', isLoggedIn, async(req, res, next) => {
  try{
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [{
        model: db.Post,
        as: 'Retweet',
      }]
    })
    if(!post){
      return res.status(404).send('No post!');
    }
    if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id) ){
      return res.status(403).send('this is my post');
    }
    const targetRetweetId = post.id || post.RetweetId;
    const exPost = await db.Post.findOne({
      where:{
        UserId: req.user.id,
        RetweetId: targetRetweetId,
      },
    });
    if(exPost){
      return res.status(403).send('Retweet duplicated!');
    };
    const retweet = await db.Post.create({
      UserId: req.user.id,
      RetweetId: targetRetweetId,
      content: 'retweet',     
    })
    const retweetWithPrevPost = await db.Post.findOne({
      where: {id: retweet.id},
      include:[{
        model: db.User,
        attributes: ['id', 'nickname'],
      },{
        model: db.Post,
        as:'Retweet',
        include: [{
          model: db.Image,
        }, {
          model: db.User,
          attributes: ['id', 'nickname'],
        }]
      }]
    });
    return res.json(retweetWithPrevPost);
  }catch(e){
    console.error(e);
    next(e);
  }
})

router.delete('/:id', isLoggedIn, async(req, res, next) => {
  try{
    const post = await db.Post.findOne({
      where: {id: req.params.id},
    })
    if(!post){
      return res.status(401).send('No post!');
    }
    await db.Post.destroy({
      where: { id: req.params.id },
    })
    res.send(req.params.id);
  }catch(e){
    console.error(e);
    next(e);
  }
})

router.get('/:id', async (req, res, next) => {
  try{
    const post = await db.Post.findOne({
      where: {id: req.params.id},
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }]
    })
    res.json(post);
  }catch(e){
    console.error(e);
    next(e);
  }
})

module.exports = router;