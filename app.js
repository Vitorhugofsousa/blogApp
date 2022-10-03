//Upload dos módulos
const express = require('express')
const {engine} = require("express-handlebars")
const bodyParser = require('body-parser')
const session = require("express-session")
const flash = require("connect-flash")
const passport = require('passport')
require('./config/auth')(passport)
const path = require('path')
const app = express()
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const Categoria = require('./models/Categoria')
const Postagem = require('./models/Postagem')
const Usuario = require('./models/usuario')
const { post } = require('./routes/admin')


//////CONFIGURAÇÕES DE MÓDULOS
//session
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//middleware
app.use((req,res, next) => {
 res.locals.success_msg = req.flash("success_msg")
 res.locals.error_msg = req.flash("error_msg")
 res.locals.error = req.flash("error")
 res.locals.user = req.user || null;
 next()
})

//body-Parser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', engine({defaultLayout: 'main',  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
},}))
app.set('view engine', 'handlebars');

//sequelize


//public
app.use(express.static(path.join(__dirname, "public")))


/////ROTAS
//Rotas das Postagens
app.get("/", (req,res)=>{
    Postagem.findAll().then((postagens)=>{

        res.render("index", {postagens: postagens})
    }).catch((err)=>{
        
        req.flash("error_msg", "Houve um Erro interno ao Carregar a Página.")
        res.redirect("/404")
    })

})


app.get("/postagem/:slug", (req,res)=> {
    Postagem.findAll({where:{slug:req.params.slug}}).then((postagens)=> {
        if(postagens){
            res.render("postagem/index", {postagens: postagens})
        }else{
            req.flash("error_msg", "essa postagem não existe.")
            res.redirect("/")
        }
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno ao carregar esse post.")
        res.redirect("/")
    })
})

//Rotas das Categorias

app.get("/categorias", (req,res) => {
    Categoria.findAll().then((categorias)=>{
        res.render("categorias/index", {categorias: categorias})
        
    }).catch((err)=>{
        req.flash("error_msg", "Houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})


app.get("/categorias/:slug", (req,res)=> {
    Categoria.findOne({where:{slug:req.params.slug}}).then((categoria)=> {
        if(categoria){

            Postagem.findAll({where:{categoria:categoria.id}}).then((postagens)=>{
                res.render("categorias/cat-posts", {postagens: postagens, categoria: categoria})
            }).catch((err)=>{
                console.log(categoria)
                req.flash("error_msg", "Houve um erro ao listar os posts.")
                res.redirect("/categorias")
            })
        }else{
            req.flash("error_msg", "essa categoria não existe.")
            res.redirect("/categorias")
        }
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro interno ao carregar esse categoria.")
        res.redirect("/categorias")
    })
})

//Rotas de Erros
app.get("/404", (req,res) => {
    res.send('Erro 404!')
})


//Rotas Externas
app.use('/admin', admin)
app.use('/usuarios', usuarios)


/////OUTRAS CONFIG
const PORT = 8081
app.listen(PORT,() => {
    console.log('servidor rodando!')
})