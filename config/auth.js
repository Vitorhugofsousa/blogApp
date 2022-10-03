const localStrategy = require('passport-local').Strategy
const Sequelize = require('sequelize')
const bcrypt = require("bcryptjs")

//Model de Usuário 
const Usuario = require('../models/usuario')
const usuario = require('../models/usuario')

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done)=>{
       
        Usuario.findOne({where:{email: email}}).then((usuario)=>{
            if(!usuario){
                return done( null, false, {message: "Esta conta não existe"})
            }

            bcrypt.compare(senha,usuario.senha, (erro, batem)=>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha Incorreta!"})
                }
            })

        })
    }))


passport.serializeUser((usuario, done)=>{
    done(null, usuario.id)
})

passport.deserializeUser((id, done) => {
    Usuario.findByPk(id, {raw: true})
    .then((usuario) =>{
        done(null, usuario)
    }) 
    .catch((err) => {
        done(err, null);
    });
})
}