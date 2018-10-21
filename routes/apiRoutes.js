const axios = require('axios');
const authController = require('../controllers/controller.js');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
// Require all models
const db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/nytimes", { useNewUrlParser: true });

module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    res.render('home');
  });

  app.get("/api/headlines?saved=false", function(req, res){

  });

  app.get("/api/headlines/:id", function(req, res){

  });

  // scrape articles
  app.get("/api/fetch", function(req, res){
// A GET route for scraping the nytimes website
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com//").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article a").each(function(i, element) {

      // console.log($(this).children("a"))
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this).text()
      result.url = 'https://www.nytimes.com/' + $(this).attr("href")

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
  });

  app.get("api/clear", function(req, res){

  });

  app.get("/api/notes/:id", function(req, res){

  });

  app.get("/api/notes", function(req, res){

  });
}