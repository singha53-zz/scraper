var axios = require('axios');
var authController = require('../controllers/controller.js');

module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    res.render('home');
  });

  app.get("/api/headlines?saved=false", function(req, res){

  });

  app.get("/api/headlines/:id", function(req, res){

  });

  app.get("/api/fetch", function(req, res){

  });

  app.get("api/clear", function(req, res){

  });
}