const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true, useUnifiedTopology: true});

const articleSchema = mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

    //////////////////////////////////////////////////////////// REQUESTS FOR ALL ARTICLES //////////////////////////////////////////////////////////////////////

app.route("/articles")  
    .get(function(req, res) {
        Article.find({}, function(err, docs) {
            if(!err)
                res.send(docs);
            else
                res.send(err);
        });
    })

    .post(function(req, res) {

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });

        newArticle.save(function(err){
            if(!err)
                res.send("Success");
            else
                res.send(err);
        });
    })

    .delete(function(req, res) {
        Article.deleteMany({}, function(err) {
            if(!err)
                res.send("Sucessfully deleted all articles");
            else
                res.send(err);
        });
    });


    ////////////////////////////////////////////////// REQUESTS FOR SINGLE ARTICLE ////////////////////////////////////////////////////////

app.route("/articles/:articleName")
    .get(function(req, res){
        Article.findOne({title : req.params.articleName}, function(err, artic) {
            if(!err)
            {
                if(artic)
                    res.send(artic);
                else
                    res.send("No article with that title");
            }
            else    
                res.send(err);
        })
    })

    .put(function(req, res) {
        Article.update({title : req.params.articleName}, {title : req.body.title, content : req.body.content}, {overwrite : true}, function(err) {
            if(!err)
                res.send("Successfully updated an article");
        });
    })

    .patch(function(req, res) {
        Article.update({title : req.params.articleName}, {$set : req.body}, function(err) {
            if(!err)
                res.send("Successfull updated");
            else
                res.send(err);
        });
    })

    .delete(function(req, res) {
        Article.deleteOne({title : req.params.articleName}, function(err) {
            if(!err)
                res.send("Successfully deleted one article");
            else    
                res.send(err);
        });
    });


app.listen(3000, function() {
    console.log("Server up and running on port 3000");
});