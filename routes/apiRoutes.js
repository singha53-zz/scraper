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
  // saved pages
  app.get('/saved', function (req, res) {
    res.render('saved');
  });

  // save article to database by changed saved field to true
  app.put("/api/headlines/:id", function(req, res){
    var saved = req.body.saved == 'true'
    if(saved){
    db.Article.updateOne({id: req.body._id},{$set: {saved:true}}, function(err, result){
    if (err) {
      console.log(err)
    } else {
      return res.send(true)
    }
    })
}

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
			db.Article.findOne({headline: result.headline}, function(err, data) {
        if(err){
          console.log(err)
        } else {
          if (data === null) {
					db.Article.create(result)
           .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
          });
				}
        }
			});
      }

      });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
  });

  app.get("/api/headlines", function(req, res){
    console.log(req.query.saved)
    console.log(req.body)
    if(req.query.saved === true){
     
    } else {
   db.Article.find({saved: false})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    }
  });

  app.get("api/clear", function(req, res){

  });

  app.get("/api/notes/:id", function(req, res){

  });

  app.get("/api/notes", function(req, res){

  });
}