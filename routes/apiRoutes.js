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

  app.get("/api/headlines/:id", function(req, res){

  });

  // scrape articles
  app.get("/api/fetch", function(req, res){
// A GET route for scraping the nytimes website
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {

      // Save an empty result object
      var result = {};
      result.headline = $(element).find("h2").text().trim();
      result.url = 'https://www.nytimes.com' + $(element).find("a").attr("href");
      result.summary = $(element).find("p").text().trim();

      if (result.headline !== '' && result.summary !== ''){
			db.Article.find({headline: result.headline}, function(err, data) {
				if (data.length === 0) {
          result.saved = false;
					db.Article.create(result, function(err, data) {
						if (err) throw err;
					});
				}
			});
      }

      });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
  });

  app.get("/api/headlines?saved=false", function(req, res){

  });

  app.get("api/clear", function(req, res){

  });

  app.get("/api/notes/:id", function(req, res){

  });

  app.get("/api/notes", function(req, res){

  });
}