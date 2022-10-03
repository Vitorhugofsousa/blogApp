//grupo de rotas de admin

const express = require('express')
const router =  express.Router()
const Categoria = require('../models/Categoria')
const Postagem = require('../models/Postagem')
const {eAdmin} = require("../helpers/eAdmin")

router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})


///////////ROTAS DAS CATEGORIAS
router.get('/categorias',eAdmin, (req, res) => {
    Categoria.findAll().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve Um erro ao listar as categorias")
        res.redirect("/admin/")
    })
 
})
router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

////verificaçoesde dados

//verificação de cadastro de nova categoria
router.post("/categorias/nova", eAdmin, (req, res) => {

    var erros= []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.slug || typeof  req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto:"nome da categoria é muito pequeno!"})
    }

    if(erros.length > 0 ){
        res.render("admin/addcategorias", {erros: erros})
    }else{

        const novaCategoria = {
        nome: req.body.nome,
        slug: req.body.slug
    }
    
    new Categoria(novaCategoria).save().then(() => {
        req.flash("success_msg", "categoria criada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Erro ao criar Categoria!")
    })
    }

})

router.get("/categorias/edit/:id", eAdmin,(req, res) => {
    Categoria.findAll({where:{id:req.params.id}}).then((categoria)=> {
        if (categoria.length < 1) {
            req.flash("error_msg", "Essa Categoria Não existe!")
            res.redirect("/admin/categorias")
        }
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        res.redirect("/admin/categorias")
    })
   
})


//verificação de edição de categoria
router.post("/categorias/edit", eAdmin,(req, res) => {
    Categoria.findOne({where:{id:req.body.id}}).then((categoria)=>{
    
    var erros= []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }

    if(req.body.nome.length < 2){
        erros.push({texto:"nome da categoria é muito pequeno!"})
    }
    
    if(erros.length > 0 ){
        res.render("admin/addcategorias", {categoria:categoria, erros: erros})
    }else{
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
        
        categoria.save().then(()=>{
            req.flash("success_msg", "Categoria Editada com Sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro  interno ao salvar a edição dessa categoria.")
                })
            }
        }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao editar essa categoria.")
        res.redirect("/admin/categorias")
        })


})

router.post("/categorias/deletar", eAdmin,(req,res) => {
    Categoria.destroy({where:{id:req.body.id}}).then(() => {
        req.flash("success_msg", "Categoria Excluida com Sucesso!")
        res.redirect("/admin/categorias")
    }).catch(() => {
        req.flash("error_msg", "Erro ao Excluir Categoria.")
        res.redirect("/admin/categorias")
    })
})



///////////ROTAS DAS POSTAGENS
router.get('/posts', eAdmin,(req, res) => {
    res.send('pagina de posts')
})

router.get("/postagens", eAdmin,(req,res) => {
    Postagem.findAll({include:[{attributes:["nome","slug"] ,model:Categoria}]}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
        console.log(postagens)
    }).catch((err) => {
        req.flash("error_msg", "Houve Um erro ao listar os seus posts")
        res.redirect("/admin/postagens")
    })

    
})

router.get("/postagens/add", eAdmin,(req,res) => {
    Categoria.findAll().then((categorias)=>{
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro ao carregar a página.")
        res.redirect("/admin/postagens")
    })
})


router.post("/postagens/nova", eAdmin,(req,res) => {

    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Título Inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição Inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Descrição Inválida"})
    }

    if(req.body.titulo.length < 2){
        erros.push({texto:"Título do post é muito pequeno!"})
    }

    if(req.body.slug.length < 3){
        erros.push({texto:"Slug do post é muito pequeno!"})
    }

    if(req.body.descricao.length < 3){
        erros.push({texto:"Descrição do post é muito pequena!"})
    }

    if(req.body.conteudo.length < 10){
        erros.push({texto:"O conteúdo do post deve ter ao menos 10 caracteres!"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }


    if(erros.length > 0 ){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            idcategoria: req.body.categoria
            
        }
        
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "post criado com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao criar sua postagem!")
            res.redirect("/admin/postagens")
        })
    }
 
})



router.get("/postagens/edit/:id", eAdmin,(req, res) => {
    Postagem.findAll({where:{id:req.params.id}}).then((postagens)=> {
        
        Categoria.findAll().then((categorias)=> {
            if (postagens.length < 1) {
                req.flash("error_msg", "Esse Post Não existe!")
                res.redirect("/admin/postagens")
            }
            res.render("admin/editpostagem", {categorias:categorias, postagens: postagens})
            
        }).catch((err) => {
            req.flash("error_msg", "Erro ao carregar categorias no formulário de edição de post.")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulário de edição de post.")
        res.redirect("/admin/postagens")
    })
   
})
   


//verificação de edição de categoria
router.post("/postagens/edit", eAdmin,(req, res) => {
    Postagem.findOne({where:{id:req.body.id}}).then((postagem)=>{
    
    var erros= []
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Título Inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug Inválido"})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Descrição Inválida"})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Descrição Inválida"})
    }

    if(req.body.titulo.length < 2){
        erros.push({texto:"Título do post é muito pequeno!"})
    }

    if(req.body.slug.length < 3){
        erros.push({texto:"Slug do post é muito pequeno!"})
    }

    if(req.body.descricao.length < 3){
        erros.push({texto:"Descrição do post é muito pequena!"})
    }

    if(req.body.conteudo.length < 10){
        erros.push({texto:"O conteúdo do post deve ter ao menos 10 caracteres!"})
    }

    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria inválida, registre uma categoria"})
    }
    
    if(erros.length > 0 ){
        res.render("admin/addpostagens", {postagem:postagem, erros: erros})
    }else{
            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
            
            postagem.save().then(()=>{
            req.flash("success_msg", "Post Editado com Sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro  interno ao salvar a edição desse post.")
                })
            }
        }).catch((err)=>{
        
        req.flash("error_msg", "Houve um erro ao editar essa postagem.")
        res.redirect("/admin/postagens")
        })


})

router.post("/postagens/deletar", eAdmin,(req,res) => {
    Postagem.destroy({where:{id:req.body.id}}).then(() => {
        req.flash("success_msg", "Postagem Excluida com Sucesso!")
        res.redirect("/admin/postagens")
    }).catch(() => {
        req.flash("error_msg", "Erro ao Excluir Postagem.")
        res.redirect("/admin/postagens")
    })
})



module.exports = router