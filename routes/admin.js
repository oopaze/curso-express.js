const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/categorias")
const Categoria = mongoose.model('categorias')
require("../models/postagens")
const Postagem = mongoose.model('postagens')


router.get('/', (req, res) => {
  res.render("admin/index");
});

router.get('/posts', (req, res) => {
  res.send("Página de posts");
});

router.get('/categorias', (req, res) => {
  Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
    res.render('admin/categorias', {categorias:categorias});
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as categorias!")
  });
});

router.get('/categorias/add', (req, res) => {
  res.render('admin/addcategorias');
});

router.post("/categorias/nova", (req, res) => {
  var erros = [];
  if (req.body.slug.split().lenght < 2){
    erros.push({texto: "Slug inválido"});
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
    };

    new Categoria(novaCategoria).save().then(() => {
      req.flash('success_msg', "Categoria criada com sucesso!")
      res.redirect('/admin/categorias');
    }).catch((err) => {
      req.flash('error_msg', "Houve um erro ao salvar a categoria, tente novamente!")
    });
  };
  res.render("admin/addcategorias", {erros: erros})
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
    res.render('admin/editcategorias', {categoria: categoria});
  }).catch((err) => {
    req.flash("error_msg", "Categoria Inválida!");
    res.redirect("/admin/categorias");
  });
});

router.post('/categorias/edit', (req, res) => {


  Categoria.findOne({_id: req.body.id}).then((categoria) => {
    categoria.nome = req.body.nome;
    categoria.slug = req.body.slug;

    categoria.save().then(() => {
      req.flash('success_msg', 'Categoria editada com sucesso!');
      res.redirect('/admin/categorias');
    }).catch((err) => {
      req.flash('error_msg', 'Houve um erro ao salvar a categoria!');
      res.redirect('/admin/categorias');
    });

  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao editar a categoria!")
    res.redirect("/admin/categorias")
  });
})

router.post('/categorias/delete', (req, res) => {
  Categoria.remove({_id: req.body.id}).then(() => {
    req.flash('success_msg', 'Categoria deletada com sucesso!');
    res.redirect('/admin/categorias');
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao deletar categoria!');
    res.redirect('/admin/categorias');
  });
});

router.get('/postagens', (req, res) => {
  Postagem.find().populate("categoria").lean().sort({data:"desc"}).then((postagens) => {
    res.render("admin/postagens", {postagens:postagens});
  }).catch((err) => {
    req.flash('error_msg', "Houve um erro ao listar postagens!");
    res.redirect('/admin')
  })
});

router.get('/postagens/add', (req, res) => {
  Categoria.find().lean().then((categorias) => {
    res.render("admin/addpostagens", {categorias:categorias});
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao carregar o formulario');
  });
})

router.post('/postagens/nova', (req, res) => {
  var erros = []
  if(req.body.categoria == 0){
    erros.push({texto:"Categoria inválida, registre uma categoria!"});
  };

  if(erros.length > 0){
    res.render("admin/addpostagens", {erros: erros});
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.titulo,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug
    };
    new Postagem(novaPostagem).save().then(() => {
      req.flash('success_msg', 'Postagem criada com sucesso');
      res.redirect('/admin/postagens');
    }).catch((erro) => {
      req.flash("error_msg", "Houve um erro durante o salvamento da Postagem!");
      res.redirect('/admin/postagens');
    });
  };
});

module.exports = router
