const Sequelize = require('sequelize')
const sequelize = require('Sequelize')
const db = require('./db')

const Usuario = db.sequelize.define ( 'usuario' , {

    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    virtude: {
        type: sequelize.INTEGER,
        defaultValue: 0
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    }




})

//Usuario.sync({force: true})

module.exports = ("usuarios", Usuario);