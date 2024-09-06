const db = require('./db');
const Sequelize = require('sequelize');  // Assumindo que você já tenha configurado a conexão ao banco de dados

const talhao = db.define('talhao', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(128),
        allowNull: false
    },
    cultura: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    area: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    geojson_data: {
        type: Sequelize.JSON,
        allowNull: false
    },
    id_propriedade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'propriedade',  // Nome da tabela referenciada
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: false      // Se não utilizar os campos createdAt e updatedAt
});


// Caso a tabela não exista, ela é criada automaticamente
propriedades.sync();

module.exports = talhao;
