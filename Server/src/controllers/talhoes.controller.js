const turf = require('@turf/turf');
const fs = require('fs').promises; // Para trabalhar com o conteúdo do arquivo

const talhoes = require('../models/talhoes.model');
const propriedades = require('../controllers/propriedades.controller')
const { getID, getNome } = require('../auth/autenticacao');
const { where } = require('sequelize');


function capitalizeWords(text) {
    return text.replace(/\w\S*/g, function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}

const procuraTalhao = async (nomeTalhao, idPropriedade) => {
    nomeTalhao = capitalizeWords(nomeTalhao);

    const busca = await talhoes.findOne( {
        where: { nome: nomeTalhao, id_propriedade: idPropriedade},
    })
    return busca
}

const verificaArquivo = (arquivo) => {
    const fileContent = arquivo.buffer.toString('utf-8');
    let parsedData;
    try {
        parsedData = JSON.parse(fileContent); // Tente fazer o parse do arquivo
        //console.log(parsedData)

        if (!parsedData.features[0].geometry.coordinates[0] || !Array.isArray(parsedData.features)) 
            return { error: 'Arquivo GeoJSON inválido. As coordenadas não foram encontradas.' };

    } catch (error) {
        return { error: 'Arquivo inválido! Deve ser um GeoJSON válido.' };
    }

    return {erro: null, data: parsedData};
}

// Rota para processar o arquivo e dados do formulário
const cadastrarPropriedade =  async (req, res) => {
    const { tokenJWT, nome, cultura, propriedade, modo } = req.body;
    const arquivo = req.file;
    
    try {
        const id_usuario = await getID(tokenJWT)
        if (!id_usuario) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        const existePropriedade = await propriedades.procuraPropriedade(propriedade, id_usuario)
        if(!existePropriedade)
            return res.status(400).json({ message: 'A propriedade informada não existe no sistema.' });

        const id_propriedade = existePropriedade.id
        const existeTalhao = await procuraTalhao(nome, id_propriedade)
        if(existeTalhao)
            return res.status(400).json({ message: 'A propriedade selecionada já possui um talhão com o nome informado.' });

        // Verificar o arquivo
        const { error, data: parsedData } = verificaArquivo(arquivo);
        if (error) {
            return res.status(400).json({ message: error });  // Enviar o erro caso ocorra
        }

        areaTalhao = calculaArea(parsedData.features[0].geometry.coordinates)

        const novoTalhao = await talhoes.create({
            nome,
            cultura,
            area: areaTalhao,
            geojson_data: parsedData,
            id_propriedade
        })

        res.status(200).json({ message: 'Talhão adicionado com sucesso!' });

    } catch (error) {
        console.error('Erro no processamento:', error);
        res.status(500).json({ message: 'Erro ao processar o arquivo e os dados.' });
    }
};



const calculaArea = (coordinates) => {
    
    // Crie um polígono usando Turf.js
    const polygon = turf.polygon(coordinates);
    // Calcule a área do polígono em metros quadrados
    const area_m2 = turf.area(polygon);
    // Converta a área para hectares (1 hectare = 10,000 metros quadrados)
    const area_hectares = area_m2 / 10000;

    console.log(`A área do polígono é de ${area_m2.toFixed(2)} metros quadrados ou ${area_hectares.toFixed(2)} hectares.`);
    return area_hectares.toFixed(2)
}


module.exports = {cadastrarPropriedade};