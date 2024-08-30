const express = require('express');
const usuarios = require('../controllers/usuarios.controller');
const token = require('../auth/autenticacao');

const router = express.Router();
router.use(express.json());


router.post('/login', usuarios.login);
router.post('/novo-usuario', usuarios.create);
router.post('/autenticar', token.autenticacao);


module.exports = {
    router
};