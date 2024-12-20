const express = require('express');
const mapa = require('../controllers/map.controller');

const router = express.Router();
router.use(express.json());


router.post('/mapalivre', mapa.validaMap, mapa.getFreeMap);
router.post('/mapatalhao', mapa.validaMap, mapa.getMap);


module.exports = {
    router
};