const ndvi = require('../models/ndvi.model');
const talhoes = require('../models/talhoes.model');
const { where } = require('sequelize');


async function getMostRecentCaptureDate(id_talhao) {
    try {
        const latestRecord = await ndvi.findOne({
            order: [['capture_date', 'DESC']],
            attributes: ['capture_date'],
            where: {
                id_talhao
            }
        });

        if (latestRecord) {
            return latestRecord.capture_date;
        } else {
            return null; // Nenhum registro encontrado
        }
    } catch (error) {
        console.error('Erro ao buscar a data mais recente:', error);
        throw error; // Repassa o erro para ser tratado onde a função for chamada
    }
}

const getAllNDVIs = async (requisicao, resposta) => {

    const { id_talhao } = requisicao.params;
    try {
        const ndvis = await ndvi.findAll({
            order: [['capture_date', 'ASC']],
            attributes: ['capture_date', 'cloud_percentage', 'valor'],
            where: {
                id_talhao
            }
        }).then((ndvisSalvos) => {
            resposta.status(200).send({
              ndvis: ndvisSalvos
            });
        })
        .catch(() => {
        resposta.status(500).send({ message: 'Ocorreu algum erro inesperado no servidor!' });
        });;


    } catch (error) {
        console.error('Erro ao buscar NDVIs do talhao:', error);
        throw error; // Repassa o erro para ser tratado onde a função for chamada
    }
}


const inserirNDVI = async (dadosNDVI) => {

    // Verifica se todas as propriedades têm os campos necessários
    const dadosNDVIFormatados = dadosNDVI.map(data => ({
        capture_date: data[0],
        valor: data[1],
        cloud_percentage: data[2],
        id_talhao: data[3]
    }));


    try {
        // Realiza o bulk insert
        await ndvi.bulkCreate(dadosNDVIFormatados);
        return true;
    } catch (erro) {
        console.error(erro);
        return false;
    }

};



module.exports = {
    getMostRecentCaptureDate, inserirNDVI, getAllNDVIs
};
