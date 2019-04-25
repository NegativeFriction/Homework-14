var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var mongo = require('mongojs')

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


var databaseUri = "mongodb://localhost/hw14"

if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
    });
    db = mongoose.connection;
    db.on('error',function(err){
        console.log("Mongoose Error: ",err)
    })
    db.once("open",function(){
        console.log("Mongoose connection succesful.")
    })
}
    else{
        mongoose.connect(databaseUri, {
  useNewUrlParser: true
    })
}


app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/newComment/:id",function(req,res){
    let id = req.params.id;
        
        res.sendFile(path.join(__dirname, "./public/comments.html"));
    })

app.get("/articles", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.bbc.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".media__content").each(function(i, element) {
      //   console.log("i", i);
      //   console.log("element", element);
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.headline = $(this)
        .children("h3")
        .text()
        .trim();

      result.summary = $(this)
        .children(".media__summary")
        .text()
        .trim();

      result.link = $(this)
        .children(".block-link__overlay-link")
        .attr("href");

      result.comments = [];

      db.Article.find({ headline: result.headline }, function(err, data) {
        if (err) throw err;
        if (!data) {
        //   console.log("New article found");
          // Create a new Article using the `result` object built from scraping
          db.Article.create(result)
            .then(function(dbArticle) {
              // View the added result in the console
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        }
      });
    });
    console.log("done scraping");

    // Send a message to the client
    res.send("Scrape Complete");
  });
});

app.get("/articles_with_comments",function(req,res){
    db.Article.find({},function(err,data){
        if(err) throw err;
        
        res.json(data)
    })
})

app.get("/comments/:id",function(req,res){
    let id = req.params.id;
    db.Article.find({_id:mongojs.ObjectId(id) },function(err,data){
        if(err) throw err;
        res.json(data)
});
});

app.post("/newComment/:id/submit",function(req,res){
    console.log(req.body)
})

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
