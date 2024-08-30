const usuarios = require('../models/usuarios.model')
const { gerarToken } = require('../auth/autenticacao');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const existeEmail = async (email) => {
    const procuraEmail = await usuarios.findAll( {
        attributes: ['email'],
        where: { email: email }
    } )
    return procuraEmail.length != 0;
}

const existeConta = async (email) => {
    const procuraConta = await usuarios.findOne( {
        where: { email: email }
    } )

    return procuraConta;
}


const create = async (requisicao, resposta) => {
    const id = crypto.randomUUID();
    const nome = requisicao.body.nome;
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if(!nome || !email || !senha)
    {
        resposta.status(400).send({
            mensagem: "O corpo da requisição não corresponde ao esperado!"
        });
    }
    else
    {
        const salt = bcrypt.genSaltSync();
        const senhaHash = bcrypt.hashSync(senha, salt);

        if(nome.length < 4){
            resposta.status(400).send({ message: 'O nome deve ter pelo menos 4 caracteres.'})
        } 
        else if(senha.length < 6 ){
            resposta.status(400).send({ message: 'A senha deve ter pelo menos 6 caracteres, além de conter letras e números.'})
        }
        else if ( await existeEmail(email) ) {
            resposta.status(400).send({ message: 'Esse email já esta cadastrado.'})
        }
        else {
            await usuarios.create( {
                id, nome, email, senha: senhaHash, salt
            }).then( () => {
                resposta.status(201).send({
                    message: 'Usuário criado com sucesso!',
                    id
                })
            }).catch( () => {
                resposta.status(500).send({message: 'Ocorreu algum erro inesperado!'})
            });
        }
    }

};


const login = async (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;
    
    if(email && senha)
    {
        const procuraConta = await existeConta(email);
        if (procuraConta) {                                                   // Tenta Logar
            const salt = procuraConta.dataValues.salt;
            const senhaBD = procuraConta.dataValues.senha;

            if( bcrypt.hashSync(senha, salt) === senhaBD){                   // Senha aceita
                const nome = procuraConta.dataValues.nome;
                const id = procuraConta.dataValues.id;
                const token = gerarToken(nome, id);
                resposta.status(201).send({
                    message: 'Usuario autenticado com sucesso!',
                    token: token
                });
            } 
            else {                                                        // Senha incorreta
                resposta.status(400).send({message: 'Senha incorreta.'})
            }
        } 
        else {
            resposta.status(400).send({message: "Email não encontrado."})
        }
    }
    else 
    {
        resposta.status(400).send({
            mensagem: "O corpo da requisição não corresponde ao esperado!"
        });
    }

};

module.exports = {create, login};