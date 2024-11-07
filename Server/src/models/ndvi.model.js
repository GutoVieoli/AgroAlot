const db = require('./db');
const Sequelize = require('sequelize');  // Assumindo que você já tenha configurado a conexão ao banco de dados

const ndvi = db.define('ndvi', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    capture_date: { 
        type: Sequelize.DATE,
        allowNull: false
    },
    cloud_percentage: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false
    },
    valor: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false
    },
    id_talhao: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'talhoes',  // Nome da tabela referenciada
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'ndvi',
    timestamps: false      // Se não utilizar os campos createdAt e updatedAt
});


// Caso a tabela não exista, ela é criada automaticamente
ndvi.sync();

module.exports = ndvi;
