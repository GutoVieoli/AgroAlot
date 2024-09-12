const propriedades = require('../models/propriedades.model');
const { getID, getNome } = require('../auth/autenticacao');
const { where } = require('sequelize');


function capitalizeWords(text) {
    return text.replace(/\w\S*/g, function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}


const procuraPropriedade = async (nome, id_usuario) => {
    nome = capitalizeWords(nome);
    const procuraPropriedade = await propriedades.findOne( {
        where: { nome, id_usuario }
    })
    return procuraPropriedade
}



const cadastrarPropriedade = async (requisicao, resposta) => {
    const nome = capitalizeWords(requisicao.body.nome);
    const tokenJWT = requisicao.body.tokenJWT
    const localizacao = requisicao.body.localizacao

    
    if(nome && tokenJWT && localizacao){
        const id_usuario = getID(tokenJWT)
        const existePropriedade = await procuraPropriedade(nome, id_usuario)

        if( !existePropriedade){
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

const listarPropriedades = async (requisicao, resposta) => {
    const tokenJWT = requisicao.body.tokenJWT
    const id_usuario = getID(tokenJWT)

    await propriedades.findAll( {
        attributes: ['id', 'nome', 'localizacao', 'area_total'],
        where: { id_usuario }
    } ).then( (propriedadesSalvas) => {
        resposta.status(201).send({
            propriedades: propriedadesSalvas
        })
    }).catch( () => {
        resposta.status(500).send({message: 'Ocorreu algum erro inesperado no server!'})
    });

}

module.exports = {cadastrarPropriedade, listarPropriedades, procuraPropriedade};