var axios = require('axios');
var authController = require('../controllers/controller.js');

module.exports = function (app) {
  // home page
  app.get('/', function (req, res) {
    res.render('home');
  });
}