/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new Schema(
  {
    titulo: String,
    categoria: String,
    conteudo: String,
    slug: String,
    imagem: String,
    autor: String,
    views: Number,
  },
  { collection: "posts" }
);

var Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
