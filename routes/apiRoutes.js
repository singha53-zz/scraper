const axios = require('axios');
const cheerio = require("cheerio");
const mongoose = require("mongoose");
// Require all models
const db = require("../models");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    db.Article.find({saved: false}, function(err, data){
      res.render('home', { home: true, article : data });
    })
  });

  // saved pages
  app.get('/saved', function (req, res) {
    db.Article.find({saved: true}, function(err, data){
      res.render('saved', { home: false, article : data });
    })
  });

  // save article to database by changed saved field to true
  app.put("/api/headlines/:id", function(req, res){
    var saved = req.body.saved == 'true'
    if(saved){
      db.Article.updateOne({_id: req.body._id},{$set: {saved:true}}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
    }
  });

  // delete article from database
  app.delete("/api/headlines/:id", function(req, res){
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Article.deleteOne({_id: req.params.id}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
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
             console.log(dbArticle)
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          console.log(err)
          });
				}
        console.log(data)
        }
			});
      }

      });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape completed!");
  });
  });

  // get back all notes for a given article
  app.get("/api/notes/:id", function(req, res){
    // res.send(true)
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
      console.log(dbArticle.note)
      res.json(dbArticle.note)
    })
    .catch(function(err){
      res.json(err)
    })
  });

  // add note to an article
    app.post("/api/notes", function(req, res){
    console.log(req.body)
    db.Note.create({ noteText: req.body.noteText })
    .then(function(dbNote){
      console.log('dbNote:' + dbNote)
      return db.Article.findOneAndUpdate({ _id:req.body._headlineId}, 
      { $push: {note: dbNote._id} }, 
      {new: true})
    })
    .then(function(dbArticle){
      console.log('dbArticle:'+dbArticle)
      res.json(dbArticle)
    })
    .catch(function(err){
      res.json(err);
    })
  });

  // delete note form article
  app.delete("/api/notes/:id", function(req, res){
    console.log('reqbody:' + JSON.stringify(req.params.id))
    db.Note.deleteOne({_id: req.params.id}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        return res.send(true)
      }
    });
  });

  // clear all articles from database
  app.get("/api/clear", function(req, res){
    console.log(req.body)
    db.Article.deleteMany({}, function(err, result){
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.send(true)
      }
    })
  });
}