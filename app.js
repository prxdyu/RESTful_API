// requiring the necessary packages\
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// creating an app
const app=express();

// telling that we are going to use ejs as templating
app.set("view engine","ejs");

// telling the app we are going to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// making our server to listen for anything in the port 3000
app.listen(3000,function(){console.log("Server started to listen in the port 3000");});

// connecting to the mongodb server
mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology: true,
useNewUrlParser: true,});

// creating schema for  document
const articleSchema=new mongoose.Schema({title:String,content:String});

// creating a model based on the scehma
const Article = mongoose.model("Article",articleSchema);

/////////////////////// Requests targetting all articles //////////////////////////////////

// using app.route method to implement chain route
app.route("/articles")
.get(
      // callback function for get method
      function(req,res){
        Article.find({},function(err,foundArticles){
          if(!err)
          {
          res.send(foundArticles);
          }
          else {
            res.send(err)
          }

        });
      }
    )
.post(
      // callback function for post method
      function(req,res){
        console.log("Post succesfully");
        // creating the document using the information from the post request from the user
        const article=new Article({title:req.body.title,content:req.body.content});
        article.save(function(err){
          if(!err)
          {
            res.send("Successfully added the article")
          }
          else {
            res.send(err);
          }
        });
        console.log("successfully inserted into the db");
      }
    )
.delete(
      // callback function for the route method
      function(req,res){
        Article.deleteMany({},function(err){
          if(!err)
          {
            res.send("Succesfully deleted all articles");
          }
          else {
            res.send(err);
          }
        });
      }
      );

/////////////////////// Requests targetting a specific article //////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  console.log("get method succesfully");
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(!err){
      res.send(foundArticle);
    }
    else{
      res.send(err);
    }
  })
})
.put(function(req,res){
  // Article.update({condtions},{updation},{overwritten:true},function{});
  console.log("Put successful");
  Article.replaceOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    function (err) {
      if(!err){
        res.send("Successfully Updated the Article")
      }
    });
})
.patch(function (req,res) {
  console.log("Entered the patch");
  Article.updateOne({title:req.params.articleTitle},
    {$set:req.body},function(err){
      if(!err)
      {
        res.send("Successfully Patched");
      }
      else
      {
        res.send(err);
      }
    });
})
.delete(function (req,res) {
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(!err){
      res.send("Succesfully Deleted the Article ");
    }
    else{
      res.send(err);
    }
  })
});
