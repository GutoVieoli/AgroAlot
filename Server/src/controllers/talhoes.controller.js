const propriedades = require('../models/talhoes.model');
const fs = require('fs').promises; // Para trabalhar com o conteúdo do arquivo
const { getID, getNome } = require('../auth/autenticacao');
const { where } = require('sequelize');


// Rota para processar o arquivo e dados do formulário
const cadastrarPropriedade =  async (req, res) => {
    const { nome, cultura, propriedade } = req.body;
    const arquivo = req.file;

    try {
        // Verificar se o arquivo foi enviado
        if (!arquivo) {
            return res.status(400).json({ message: 'Arquivo não enviado!' });
        }

        // Validar o conteúdo do arquivo (exemplo: verificar se é JSON válido)
        const fileContent = arquivo.buffer.toString('utf-8');
        let parsedData;
        try {
            parsedData = JSON.parse(fileContent); // Tente fazer o parse do arquivo
        } catch (error) {
            return res.status(400).json({ message: 'Arquivo inválido! Deve ser um JSON válido.' });
        }

        // Aqui você pode validar o conteúdo do JSON (exemplo: verificar propriedades)
        if (!parsedData || typeof parsedData !== 'object') {
            return res.status(400).json({ message: 'Conteúdo do arquivo JSON inválido.' });
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