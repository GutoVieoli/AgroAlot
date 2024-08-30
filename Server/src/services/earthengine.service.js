const ee = require('@google/earthengine');
const express = require('express');
const cors = require('cors');
const privateKey = require('../.private-key.json');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());


const validaMap = (req, res, next) => {
    if(req.body.data == '' || req.body.filtro == '') {
        res.status(406).json({message: 'Faltou Info'})
    }
    else if( new Date(req.body.data) > new Date ){
        res.status(406).json({message: 'Data regaçada'})
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


app.post('/requestMap', validaMap, async (req, res) => {
    const dataRecebida = new Date(req.body.data);
    const dataModificada = new Date(dataRecebida);
    dataModificada.setDate(dataModificada.getDate() - 5);

    const imageSentinel = ee.ImageCollection("COPERNICUS/S2_SR");
    var fil = imageSentinel.filterDate( dataModificada, dataRecebida).median();
  
    // Define the custom color palette
    var customPalette = ['ff0000', 'ffff00', '008514' ];
  
    // Calculate the NDRE index
    const reqFiltro = req.body.filtro;
    if(reqFiltro == 'NDVI')
        var filtro = await calcNDVI(fil, customPalette)
    else if(reqFiltro == 'NDRE')
        var filtro = await calcNDRE(fil, customPalette)
    else
        var filtro = await calcRGB(fil, customPalette)


    res.send(filtro)
} )




console.log('Authenticating Earth Engine API using private key...');
ee.data.authenticateViaPrivateKey(
    privateKey,
    () => {
      console.log('Authentication successful.');
      ee.initialize(
          null, null,
          () => {
            console.log('Earth Engine client library initialized.');
            app.listen(port);
            console.log(`Listening on port ${port}`);
          },
          (err) => {
            console.log(err);
            console.log(
                `Please make sure you have created a service account and have been approved.
Visit https://developers.google.com/earth-engine/service_account#how-do-i-create-a-service-account to learn more.`);
          });
    },
    (err) => {
      console.log(err);
    }
);
