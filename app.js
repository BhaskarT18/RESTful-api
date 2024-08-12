const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Connect to MongoDB using async/await
mongoose.connect("mongodb://localhost:27017/wikiDB")
.then(() => {
    console.log("MongoDB connected");
})
.catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

const wikiSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", wikiSchema);


//////////////////////////////////////////////////////////////Request targeting all articles ////////////////////////////////////////////////////////////////////


app.route("/articles")
.get(function (req, res) {
    Article.find()
        .then((foundArticles) => {
            res.send(foundArticles)
        })
        .catch(err => {
        
            res.send(err)
        })
    })

.post( function(req,res){
    const article1= new Article({
     title:req.body.title,
     content:req.body.content
   });
   article1.save().then(()=>{
    res.send("Succesfully added article");
   }).catch(err=>{
    res.send(err);
   });

})

.delete( function(req,res){
    Article.deleteMany()
    .then(()=>{
        res.send("succsefully deleted ");
    }).catch(err=>{
        res.send(err);
    })
})

//////////////////////////////////////////////////////////////Request targeting specific article ////////////////////////////////////////////////////////////////////


app.route("/articles/:articleTitle")
.get(function(req,res){
   
    Article.findOne({title:req.params.articleTitle })
    .then((foundArticle)=>{
        res.send(foundArticle)

    }).catch(err=>{console.error("no article found"+err);})

})

.put(function(req, res) {
    Article.findOneAndUpdate(
        { title: req.params.articleTitle },
        { title: req.body.title, content: req.body.content },
        { overwrite: true }
    )
    .then(() => {
        res.send("Successfully updated the Article");
    })
    .catch(err => {
        console.log(err);
    });
})

.patch(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set:req.body}
        ).then(()=>{
            res.send("Succesffully update perticular article")
        }).catch(err=>{console.error(err);})

})

app.listen(2000, function () {
    console.log("server is running on 2000");
});
