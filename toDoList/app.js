const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

// const items = [];
// const workItems = [];


app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-skam:MagisterialSkam10@cluster0-kiyre.mongodb.net/todoListDB", {useNewUrlParser : true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
    name : String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name : "Welcome to your todo List!"
});

const item2 = new Item({
    name : "Hit the + button to add an item to your list!"
});

const item3 = new Item({
    name : "<--- Hit this to strike out an item!"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Item.deleteMany({name : "hello"}, function(err) {
//      if(err)
//          console.log(err);
//  });



app.get("/", function(req, res) {

    Item.find({}, function(err, foundItems) {

        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
                if(err)
                    console.log(err);
                else 
                    console.log("Success");
            });
            res.redirect("/");
        }
        else{
            const day = date.getDay();
            res.render("list", {listTitle : day, newListItems : foundItems});
        }
    });
});

app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name : customListName}, function(err, foundList) {
        if(!err){
            if(!foundList){

                const list = new List({
                    name : customListName,
                    items : defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else{
                res.render("list", {listTitle : foundList.name, newListItems : foundList.items});
            }
        }
    });


});




app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name : itemName
    });

    if(listName === date.getDay())
    {
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name : listName}, function(err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }


    // if(req.body.list === "Work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle : "Work List", newListItems : workItems});
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === date.getDay())
    {
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if(!err){
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({name : listName}, {$pull : {items : {_id : checkedItemId}}}, function(err, foundList){
            if(!err)
                res.redirect("/" + listName);
        });
    }


});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server up and running on port 3000.");
});