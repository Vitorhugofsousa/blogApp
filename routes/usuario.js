const express = require('express')
const router =  express.Router()
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario')
const { where } = require('sequelize')
const { route } = require('./admin')
const passport = require("passport")

router.get("/sigin", (req,res)=>{
    res.render("usuarios/sigin")
})

router.post("/sigin", (req,res)=> {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome inválido!"})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:"Email inválido!"})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto:"Senha inválida!"})
    }
    
    if(req.body.nome.length < 5 || req.body.nome.length > 15){
        erros.push({texto:"Nome inválido! Crie um nome entre 5 a 15 caracteres!"})
        
    }
    if(req.body.senha.length < 6 || req.body.senha.length > 20){
        erros.push({texto:"Senha inválida! Crie uma senha com um valor dentre 6 a 20 caracteres!"})
        
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas apresentadas são diferentes, por favor, tente novamente."})
    }


    if(erros.length > 0){
        res.render("usuarios/sigin", {erros: erros})
    }else{
            Usuario.findOne({where:{email:req.body.email}}).then((usuario)=>{
                if(usuario){
                req.flash("error_msg", "Esse endereço de E-mail está indisponível, tente novamente!")
                res.redirect("/usuarios/sigin")
                }else{

                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha:req.body.senha
                    })

                    bcrypt.genSalt(10, (erro, salt)=> {
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=> {
                            if(erro){
                                req.flash("error_msg", "Houve um erro durante o salvamento do perfil de usuário")
                                res.redirect("/usuarios/sigin")
                            }

                            novoUsuario.senha = hash

                            novoUsuario.save().then(()=>{
                                req.flash("success_msg", "Usuario Criado com Sucesso!")
                                res.redirect("/")
                            }).catch((err)=>{
                                req.flash("error_msg", "Houve um erro ao Criar conta de usuário, tente novamente!")
                                res.redirect("/usuarios/sigin")
                            })
                        })
                    })
                }
            }).catch((err)=>{
                req.flash("error_msg", "Houve um erro interno")
            })

    }

})

router.get("/login", (req,res)=>{
    res.render("usuarios/login")
})


router.post("/login", (req, res, next)=> {

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req,res, next)

})

router.get("/logout", (req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err) }
        req.flash("success_msg", "Deslogado com sucesso!")
        res.redirect('/')
      })
})


module.exports = router