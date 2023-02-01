/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const path = require("path");
const app = express();

const Posts = require("./posts.js");

mongoose
  .connect(
    "mongodb+srv://ecassano:i8qsWSM2Rhp0FFMn@cluster0.vrxxj9o.mongodb.net/CassNews"
  )
  .then(() => {
    console.log("Conectado ao banco com sucesso!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/pages"));

app.get("/", (req, res) => {
  if (req.query.busca == null) {
    Posts.find({})
      .sort({ _id: -1 })
      .then((posts) => {
        posts = posts.map((val) => {
          return {
            titulo: val.titulo,
            categoria: val.categoria,
            conteudo: val.conteudo,
            descricaoCurta: val.conteudo.substring(0, 198),
            slug: val.slug,
            imagem: val.imagem,
          };
        });

        Posts.find()
          .sort({ views: -1 })
          .limit(4)
          .then((postsTop) => {
            postsTop = postsTop.map((val) => {
              return {
                titulo: val.titulo,
                categoria: val.categoria,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudo.substring(0, 88),
                slug: val.slug,
                imagem: val.imagem,
                views: val.views,
              };
            });
            res.render("home", { posts: posts, postsTop: postsTop });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    Posts.find(
      {
        titulo: {
          $regex: req.query.busca,
          $options: "i",
        },
      },
      (err, posts) => {
        posts = posts.map((post) => {
          return {
            titulo: post.titulo,
            categoria: post.categoria,
            conteudo: post.conteudo,
            descricaoCurta: post.conteudo.substring(0, 298),
            slug: post.slug,
            imagem: post.imagem,
            views: post.views,
          };
        });
        res.render("busca", { posts: posts, contagem: posts.length });
      }
    );
  }
});

app.get("/:slug", (req, res) => {
  Posts.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { new: true },
    (err, resp) => {
      if (resp != null) {
        Posts.find()
          .sort({ views: -1 })
          .limit(3)
          .then((postsTop) => {
            postsTop = postsTop.map((val) => {
              return {
                titulo: val.titulo,
                categoria: val.categoria,
                conteudo: val.conteudo,
                descricaoCurta: val.conteudo.substring(0, 88),
                slug: val.slug,
                imagem: val.imagem,
                views: val.views,
              };
            });
            res.render("single", { noticia: resp, postsTop: postsTop });
          })
          .catch((err) => console.log(err));
      } else {
        res.redirect("/");
      }
    }
  );
});

app.listen(3001, () => {
  console.log("server rodando...");
});
