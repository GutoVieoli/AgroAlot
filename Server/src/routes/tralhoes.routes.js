const express = require('express');
const multer = require('multer');
const talhoes = require('../controllers/talhoes.controller');

const router = express.Router();
router.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

router.post('/cadastrar', upload.single('arquivo'), talhoes.cadastrarPropriedade);


module.exports = {
    router
};