const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('../../data/index');

const authConfig = require('../../config/auth');

const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name } = req.body;

  try {

    if (await User.findOne({ name }))
      return res.status(400).send({ error: 'Usuario já cadastrado' });

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user });
  } catch (err) {
    return res.status(400).send({ error: 'Falha ao registrar.' });
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name }).select('+password');

  if (!user){
    return res.status(400).send({ error: 'Usuário não encontrado!' });
  }

  if (!await bcryptjs.compare(password, user.password))
    return res.status(400).send({ error: 'Senha inválida!' });

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, authConfig.secret, {
    expiresIn: 86400,
  });

  res.redirect('/timeline');
});

router.get('/listar/users',  async (req, res) => {
  try {
    const users = await User.find();
    res.render('quemseguir', {users : users});
    //return res.send({ users });
  } catch (error) {
    return res.status(400).send({ error: 'Error ao listar usuários!' })
  }
});

router.post('/seguir/:userId',  async (req, res) => {
  try {
    const { fId } = req.body;
    const seg = await User.findById(fId);
    const user = await User.findByIdAndUpdate(req.params.userId, {
      $push: { seguidores: seg._id }
    }, { 'new': true });

    return res.send({ user });
  } catch (error) {
    return res.status(400).send({ error: 'Error ao atualizar seguidores' })
  }
});

module.exports = app => app.use('/auth', router);