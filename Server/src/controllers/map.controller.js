const ee = require('@google/earthengine');
const talhoes = require('../models/talhoes.model');


const validaMap = (req, res, next) => {
    if(req.body.data == '' || req.body.filtro == '') {
        res.status(406).json({message: 'Escolha uma data e um filtro antes de fazer a requisição.'})
    }
    else if( new Date(req.body.data) > new Date ){
        res.status(406).json({message: 'Data inválida.'})
    }
    else { 
        next() 
    }
}

const calcNDVI = async (fil, customPalette) => {
    const NDVI = fil.expression(
        '(nir - red) / (nir + red)',
        {
            'nir': fil.select('B8'), // NIR band
            'red': fil.select('B4') // Red  band
        }
    );

    return new Promise((resolve, reject) => {
        NDVI.getMap({min: 0, max: 0.8, palette: customPalette}, (mapInfo) => {
            resolve( mapInfo.mapid );
        });
    })
}

const calcNDRE = async (fil, customPalette) => {
    const NDRE = fil.expression(
        '(nir - rededge) / (nir + rededge)',
        {
            'nir': fil.select('B8'), // NIR band
            'rededge': fil.select('B5') // Red Edge band
        }
    );

    return new Promise((resolve, reject) => {
        NDRE.getMap({min: 0, max: 0.8, palette: customPalette}, (mapInfo) => {
            resolve( mapInfo.mapid );
        });
    })
}

const calcRGB = async (fil) => {
    const RGB = fil.select(['B4', 'B3', 'B2']);

    return new Promise((resolve, reject) => {
        RGB.getMap({min: 0, max: 3000}, (mapInfo) => {
            resolve( mapInfo.mapid );
        })
    })
}

const getMap = async (req, res) => {
    const dataRecebida = new Date(req.body.data);
    const dataModificada = new Date(dataRecebida);
    const talhao_id = req.body.talhao_id;
    
    dataModificada.setDate(dataModificada.getDate() - 5);

    const mapaBd = await procuraGeoJson(talhao_id)
    const jsonMapa = mapaBd['geojson_data']

    const coordinates = jsonMapa.features[0].geometry.coordinates[0];
    const aoi = ee.Geometry.Polygon(coordinates);

    const imageSentinel = ee.ImageCollection("COPERNICUS/S2_SR");
    var fil = imageSentinel.filterBounds(aoi).filterDate( dataModificada, dataRecebida).median().clip(aoi);
  
    var customPalette = ['ff0000', 'ffff00', '008514' ];
  
    const reqFiltro = req.body.filtro;
    if(reqFiltro == 'NDVI')
        var filtro = await calcNDVI(fil, customPalette)
    else if(reqFiltro == 'NDRE')
        var filtro = await calcNDRE(fil, customPalette)
    else
        var filtro = await calcRGB(fil, customPalette)


    console.log(coordinates)
    res.send(filtro)
}

const procuraGeoJson = async (talhao_id) => {

    const busca = await talhoes.findOne( {
        attributes: ['geojson_data'],
        where: { id: talhao_id},
    })

    return busca
}

module.exports = { getMap, validaMap }