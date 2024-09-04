const express = require('express');
const propriedades = require('../controllers/propriedades.controller');

const router = express.Router();
router.use(express.json());


router.get('/criar', propriedades.cadastrarPropriedade);
router.get('/listar', propriedades.listarPropriedades);


module.exports = {
    router
};