const Sequelize = require('sequelize')
const sequelize = require('Sequelize')
const Categoria = require("./Categoria")
const db = require('./db')

const Postagem = db.sequelize.define ('postagem', {
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    descricao:{
        type: Sequelize.STRING,
        allowNull: false
    },
    conteudo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    idcategoria:{
        type: Sequelize.INTEGER,
        references: {model: "categoria", key: "id"}, 
        allowNull: false
    },
    data:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW()
    }
})


Postagem.belongsTo(Categoria,{fereignKey:'idcategoria', allowNull: false})

//Postagem.sync({force: true})

module.exports = (Postagem);