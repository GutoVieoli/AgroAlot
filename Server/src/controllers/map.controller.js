const ee = require('@google/earthengine');
const talhoes = require('../models/talhoes.model');
const ndvi = require('../controllers/ndvi.controller')


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

const getFreeMap = async (req, res) => {
    const dataRecebida = new Date(req.body.data);
    const dataModificada = new Date(dataRecebida);

    dataModificada.setDate(dataModificada.getDate() - 5);



    const imageSentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
    var colecao = imageSentinel.filterDate( dataModificada, dataRecebida).sort('CLOUDY_PIXEL_PERCENTAGE')
    var fil = ee.Image(colecao.first())

    var data = ee.Date(fil.get('system:time_start')).format('YYYY-MM-dd');
    dataRetorno = null;
    
    // Avalia e imprime os valores
    await data.evaluate(function(dataValue, error) {
        if (error) {
            console.error('Erro ao obter a data:', error);
            return false;
        } else {
            dataRetorno = dataValue;
            console.log('Data de aquisição da imagem:', dataValue);
        }
    });

    var customPalette = ['ff0000', 'ffff00', '008514' ];
  
    const reqFiltro = req.body.filtro;
    if(reqFiltro == 'NDVI')
        var filtro = await calcNDVI(fil, customPalette)
    else if(reqFiltro == 'NDRE')
        var filtro = await calcNDRE(fil, customPalette)
    else
        var filtro = await calcRGB(fil, customPalette)

    res.send({
        "data": dataRetorno,
        "filtro": filtro
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
    const centerArea = coordinates[2]

    const aoi = ee.Geometry.Polygon(coordinates);

    const imageSentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED");
    var colecao = imageSentinel.filterBounds(aoi).filterDate( dataModificada, dataRecebida).sort('CLOUDY_PIXEL_PERCENTAGE')
    var fil = ee.Image(colecao.first()).clip(aoi)

    var data = ee.Date(fil.get('system:time_start')).format('YYYY-MM-dd');
    dataRetorno = null;
    
    // Avalia e imprime os valores
    await data.evaluate(function(dataValue, error) {
        if (error) {
            console.error('Erro ao obter a data:', error);
            return false;
        } else {
            dataRetorno = dataValue;
            console.log('Data de aquisição da imagem:', dataValue);
        }
    });

    const maskNuvens = fil.select('MSK_CLDPRB').gt(5);

    const totalPixels = fil.select('B4').reduceRegion({
        reducer: ee.Reducer.count(),
        geometry: aoi,
        scale: 10, 
        maxPixels: 1e9
    });
    const cloudPixels = maskNuvens.reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: aoi,
        scale: 10,
        maxPixels: 1e9
    });
    const totalPixelsValue = await totalPixels.get('B4').getInfo();
    const cloudPixelsValue = await cloudPixels.get('MSK_CLDPRB').getInfo();
    porcentagemNuvensClipada = parseFloat( ( (cloudPixelsValue / totalPixelsValue) * 100 ).toFixed(2) );

  
    var customPalette = ['ff0000', 'ffff00', '008514' ];
  
    const reqFiltro = req.body.filtro;
    if(reqFiltro == 'NDVI')
        var filtro = await calcNDVI(fil, customPalette)
    else if(reqFiltro == 'NDRE')
        var filtro = await calcNDRE(fil, customPalette)
    else
        var filtro = await calcRGB(fil, customPalette)

    res.send({
        "data": dataRetorno,
        "nuvens": porcentagemNuvensClipada,
        "filtro": filtro,
        "centralizacao": centerArea
    })
}




const popularNDVI = async (req, res) => {

    //const talhao_id = req.body.talhao_id;
    const { talhao_id } = req.params;

    last_date = await ndvi.getMostRecentCaptureDate(talhao_id)
    if (last_date == null)
        last_date = new Date("2022-06-01");
    console.log(last_date)

    start_date = new Date(last_date)
    //start_date = new Date("2022-08-01")
    start_date.setDate(start_date.getDate() + 1);
    start_date = start_date.toISOString().split('T')[0];

    //const endDate = new Date().toISOString().split('T')[0];
    const endDate = "2025-06-05"

    if ( start_date > endDate )
        res.send();

    // Pega as coordenadas da área
    const mapaBd = await procuraGeoJson(talhao_id)
    const jsonMapa = mapaBd['geojson_data']
    const coordinates = jsonMapa.features[0].geometry.coordinates[0];

    // Cria uma geometria para as cordenadas
    const aoi = ee.Geometry.Polygon(coordinates);

    // Captura todas as imagens entre as datas que tenham até X de cloud
    const imageSentinel = ee.ImageCollection("COPERNICUS/S2_SR");
    var colecao = imageSentinel.filterBounds(aoi)
                                .filterDate( start_date, endDate)
                                .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 60));

    if(colecao.size().getInfo() > 0){

        const listaImagens = await colecao.toList(colecao.size()).getInfo();
        console.log(`Número de imagens encontradas: ${listaImagens.length}`);


        let dadosTripla = [] // Cobertura de nuvem, Text ID, e data de aquisicao 

        //listaImagens.map(async (imagemInfo, index) => {
        for (const imagemInfo of listaImagens) {
            console.log('Processando')
            const imagemId = imagemInfo.id;
            const imagem = ee.Image(imagemId);
    
            // Obtém a data de aquisição
            const data = ee.Date(imagem.get('system:time_start')).format('YYYY-MM-dd');
            const dataValue = await data.getInfo();

            // Recorta a imagem para a AOI
            const imagemClipada = imagem.clip(aoi);

            // Seleciona a banda MSK_CLDPRB para máscara de nuvens (valores acima de 50 indicam alta probabilidade de nuvens)
            const maskNuvens = imagemClipada.select('MSK_CLDPRB').gt(5);
            const shadowMask = imagemClipada.select('SCL').eq(3);

            // Conta o número total de pixels na AOI
            const totalPixels = imagemClipada.select('B4').reduceRegion({
                reducer: ee.Reducer.count(),
                geometry: aoi,
                scale: 10, // Resolução de 10 metros para Sentinel-2
                maxPixels: 1e9
            });

            // Conta o número de pixels nublados na AOI
            const cloudPixels = maskNuvens.reduceRegion({
                reducer: ee.Reducer.sum(),
                geometry: aoi,
                scale: 10,
                maxPixels: 1e9
            });

            // Conta o número de pixels sombreados
            const shadowPixels = shadowMask.reduceRegion({
                reducer: ee.Reducer.sum(),
                geometry: aoi,
                scale: 10, 
                maxPixels: 1e9
            })

            const NDVI = imagemClipada.expression(
                '(nir - red) / (nir + red)',
                {
                    'nir': imagemClipada.select('B8'), // NIR band
                    'red': imagemClipada.select('B4') // Red  band
                }
            ).rename('NDVI');
            var meanNDVI = NDVI.reduceRegion({
                reducer: ee.Reducer.mean(),
                geometry: aoi,
                scale: 10, // Escala em metros, ajuste conforme necessário
                maxPixels: 1e9
            });


            // Obtém os valores como números
            const totalPixelsValue = await totalPixels.get('B4').getInfo();
            const cloudPixelsValue = await cloudPixels.get('MSK_CLDPRB').getInfo();
            const shadowPixelsValue = await shadowPixels.get('SCL').getInfo();
            //console.log('Nuvens: '+ (cloudPixelsValue / totalPixelsValue) * 100);
            //console.log('Sombras: '+ (shadowPixelsValue / totalPixelsValue) * 100);

            // Calcula a porcentagem de cobertura de nuvens na área clipada
            let porcentagemNuvensClipada = 0;
            if (totalPixelsValue > 0) {
                porcentagemNuvensClipada = parseFloat( ( (cloudPixelsValue / totalPixelsValue) * 100 ).toFixed(2) );
                porcentagemSombrasClipada = parseFloat( ( (shadowPixelsValue / totalPixelsValue) * 100 ).toFixed(2) );
                console.log('Data: '+ dataValue + ' . Sombras: '+ porcentagemSombrasClipada + " . Nuvens: " + porcentagemNuvensClipada)

                if(porcentagemNuvensClipada < 8 && porcentagemSombrasClipada < 20){
                    const ndviMedio = meanNDVI.get('NDVI') ? await meanNDVI.get('NDVI').getInfo() : null;
                    console.log("Ndvi: " + ndviMedio + "\n^^^ Ele de cima entrou ^^^\n")
                    const taxaDeNuvens = porcentagemNuvensClipada + (porcentagemSombrasClipada * 0.65)
                    dadosTripla.push([dataValue, ndviMedio.toFixed(3), parseFloat(taxaDeNuvens), talhao_id]);
                }
            }


        //});
        };

        //await Promise.all(promises);
        await ndvi.inserirNDVI(dadosTripla)
        console.log(dadosTripla)

    }
    res.send();
}


const procuraGeoJson = async (talhao_id) => {

    const busca = await talhoes.findOne( {
        attributes: ['geojson_data'],
        where: { id: talhao_id},
    })

    return busca
}

module.exports = { getMap, getFreeMap, validaMap, popularNDVI }