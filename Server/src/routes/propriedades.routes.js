const express = require('express');
const propriedades = require('../controllers/propriedades.controller');

const router = express.Router();
router.use(express.json());


router.post('/criar', propriedades.cadastrarPropriedade);
router.post('/listar', propriedades.listarPropriedades);
router.post('/dados_talhao', propriedades.infosTalhaoPropriedade);


module.exports = {
    router
};