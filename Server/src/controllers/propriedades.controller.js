const propriedades = require('../models/propriedades.model');
const { getID, getNome } = require('../auth/autenticacao');
const { where } = require('sequelize');


function capitalizeWords(text) {
    return text.replace(/\w\S*/g, function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
}


const procuraPropriedade = async (nome) => {
    nome = capitalizeWords(nome);
    const procuraPropriedade = await propriedades.findOne( {
        where: { nome }
    })
    return procuraPropriedade
}



const cadastrarPropriedade = async (requisicao, resposta) => {
    const nome = capitalizeWords(requisicao.body.nome);
    const descricao = requisicao.body.desc
    
    if(nome){
        const existePropriedade = await procuraPropriedade(nome)

        if( !existePropriedade){
            const id_usuario = getID(requisicao.body.jwt)

            await propriedades.create({
                nome, descricao, id_usuario
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
    const tokenJWT = requisicao.body.jwt
    const id_usuario = getID(tokenJWT)

    await propriedades.findAll( {
        attributes: ['nome', 'descricao'],
        where: { id_usuario }
    } ).then( (propriedadesSalvas) => {
        resposta.status(201).send({
            propriedades: propriedadesSalvas
        })
    }).catch( () => {
        resposta.status(500).send({message: 'Ocorreu algum erro inesperado no server!'})
    });

}

module.exports = {cadastrarPropriedade, listarPropriedades};