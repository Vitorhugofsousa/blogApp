const Sequelize = require('sequelize')
const sequelize = require('Sequelize')
const db = require('./db')

const Categoria = db.sequelize.define ( 'categoria' , {

    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW()
    }




})

//Categoria.sync({force: true})

module.exports = (Categoria);