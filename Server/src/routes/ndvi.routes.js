const express = require('express');
const ndvi = require('../controllers/ndvi.controller');

const router = express.Router();
router.use(express.json());


router.get('/historico/:id_talhao', ndvi.getAllNDVIs);

module.exports = {
    router
};