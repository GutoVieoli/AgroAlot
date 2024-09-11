const talhoes = require('../models/talhoes.model');
const propriedades = require('../controllers/propriedades.controller')
const fs = require('fs').promises; // Para trabalhar com o conteúdo do arquivo
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

const verificaArquivo = (arquivo, res) => {
    const fileContent = arquivo.buffer.toString('utf-8');
    let parsedData;
    try {
        parsedData = JSON.parse(fileContent); // Tente fazer o parse do arquivo

        if (!parsedData.features[0].geometry.coordinates[0] || !Array.isArray(parsedData.features)) 
            return { error: 'Arquivo GeoJSON inválido. As coordenadas não foram encontradas.' };

    } catch (error) {
        return { error: 'Arquivo inválido! Deve ser um GeoJSON válido.' };
    }

    return parsedData;
}

// Rota para processar o arquivo e dados do formulário
const cadastrarPropriedade =  async (req, res) => {
    const { tokenJWT, nome, cultura, propriedade, modo } = req.body;
    const arquivo = req.file;
    const id_usuario = await getID(tokenJWT)

    try {
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

        // Agora, vamos simular a inserção dos dados no banco de dados
        // Substitua por sua lógica de banco de dados para salvar o talhão, cultura, etc.
        console.log('Nome do talhão:', nome);
        console.log('Cultura:', cultura);
        console.log('Propriedade:', propriedade);
        console.log('Conteúdo do arquivo:', parsedData);

        // Exemplo: Inserir no banco (substitua com sua lógica real)
        // await db.insert({ nome, cultura, propriedade, fileContent: parsedData });

        res.status(200).json({ message: 'Talhão adicionado com sucesso!' });

    } catch (error) {
        console.error('Erro no processamento:', error);
        res.status(500).json({ message: 'Erro ao processar o arquivo e os dados.' });
    }
};


const cadastrarPropriedad = async (requisicao, resposta) => {
    const nome = capitalizeWords(requisicao.body.nome);
    const tokenJWT = requisicao.body.tokenJWT
    const localizacao = requisicao.body.localizacao

    
    if(nome && tokenJWT && localizacao){
        const existePropriedade = await procuraPropriedade(nome)

        if( !existePropriedade){
            const id_usuario = getID(tokenJWT)

            await propriedades.create({
                nome, localizacao, id_usuario
            }).then( () => {
                resposta.status(201).send({
                    message: 'Propriedade criada com sucesso!'
                })
            }).catch( () => {
                resposta.status(500).send({message: 'Ocorreu algum erro inesperado!'})
            });
        }
        else {                                
            resposta.status(400).send({message: 'Propriedade já existente.'})
        }
    } 
    else {
        resposta.status(400).send({message: "Campos faltantes."})
    }
}



module.exports = {cadastrarPropriedade};