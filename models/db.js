const Sequelize = require('sequelize');
const sequelize = new Sequelize('blogapp', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306'
})

sequelize.authenticate().then(() => {
    console.log("conectado ao Mysql")
}).catch((err) => {
    console.log("erro ao se conectar: "+err)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};