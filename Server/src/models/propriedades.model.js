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
    localizacao: {
        type: Sequelize.STRING,
        allowNull: true
    },
    area_total: {
        type: Sequelize.DECIMAL,
        default: 0
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