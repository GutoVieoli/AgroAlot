const sequelize = require('sequelize');
const dbConfig = require('../config/db.config.js');


const conexao = new sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    pool: {
        max: dbConfig.POOL.max,
        min: dbConfig.POOL.min,
        acquire: dbConfig.POOL.acquire 
    }
})

conexao.authenticate().then(function(){
    console.log("Conexão com o banco de dados realizada com sucesso!")
}).catch(function(){
    console.log("Erro: Conexão com o banco de dados apresentou algum problema!")
})


module.exports = conexao;