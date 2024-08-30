const sequelize = require('sequelize');
const db = require('./db');

const usuarios = db.define('usuarios', {
    id: {
        type: sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false // Desativa o rastreamento automático de datas
});



// Caso a tabela não exista, ela é criada automaticamente
usuarios.sync();

module.exports = usuarios;