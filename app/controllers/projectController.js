const express = require('express');
const Post = require('../models/posts');
const router = express.Router();

//router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {;
    const posts = await Post.find().populate('user');
    res.render('timeline', {posts: posts});
    //return res.send({ posts });
  } catch (error) {
    return res.status(400).send({ error: 'Error ao listar posts!' })
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate('user');
    res.render('alterar', {post : post});
  } catch (error) {
    return res.status(400).send({ error: 'Error ao lista o post!' })
  }
});

router.post('/postar', async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, user: req.userId });

    res.redirect('/timeline');
    //return res.send({ post });
  } catch (error) {
    return res.status(400).send({ error: 'Error ao criar um post!' })
  }
});
router.post('/alterar/:postId', async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findByIdAndUpdate(req.params.postId, { text }, { 'new': true });
    res.redirect('/timeline');
    //return res.send({ post });
  } catch (error) {
    return res.status(400).send({ error: 'Error ao atualizar postagem' })
  }
});

router.post('/delete/:postId', async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.params.postId).populate('user');

    res.redirect('/timeline');
  } catch (error) {
    return res.status(400).send({ error: 'Error ao deletar posts!' })
  }
});

module.exports = app => app.use('/timeline', router);