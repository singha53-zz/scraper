# Scraper

Scraper is a a web app that lets users view and leave comments on the latest news from the New York Times.

## Getting started
- assuming node and npm are installed. 

```shell
$ git clone https://github.com/singha53/scraper.git
$ cd scraper/
$ npm install
```
### deploying to Heroku
```shell
$ heroku login
$ Email: <enter email>
$ Password: <password>
$ heroku create <enter app name>
$ heroku addons:create mongolab
$ git push heroku master
```
## Walkthroughs
### Scrape articles, save articles, open an article on a new tab and clear articles
![GIF](https://github.com/singha53/scraper/blob/master/public/assets/images/scrape_save_clear.gif)

### Adding and remvoing notes to saved articles then clearing articles
![GIF](https://github.com/singha53/scraper/blob/master/public/assets/images/save_notes_clear.gif)

## Programming/Scripting Languages
### Front-end
- HTML, CSS (Bootstrap)
- Javascript (JQuery)

### Back-end
- JavaScript (Node.js, v8.11.2)
- npm (v6.4.0) packages: routing (body-parser, express, path)
- templating engine: handlebars
- database: MongoDB

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcome.

## Links

- Repository: https://github.com/singha53/scraper/
- Deployed site: https://scraper-uft.herokuapp.com/

## Licensing

The code in this project is licensed under MIT license.
