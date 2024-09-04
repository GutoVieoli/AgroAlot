const db = require('./db');
const Sequelize = require('sequelize');

const propriedades = db.define('propriedades', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: true
    },
    id_usuario: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
            model: 'usuarios', // Nome da tabela referenciada
            key: 'id'
        }
    }
}, {
    timestamps: false // Desativa o rastreamento automático de datas
});



// Caso a tabela não exista, ela é criada automaticamente
propriedades.sync();

module.exports = propriedades;