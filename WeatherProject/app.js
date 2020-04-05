const express = require("express");
const https = require("https");
const bodyParser = require("body-parser"); 

const app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const queryCity = req.body.cityName;
    const apiKey = "72952b123fb622d36567088566c78cd3";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + queryCity + "&appid=" + apiKey + "&units=" + unit;
    
    https.get(url, function(response) {
        console.log(response.statusCode);
        response.on("data", function(data) {
    
            const weatherData = JSON.parse(data);
            console.log(weatherData);
    
            const temp = weatherData.main.temp;
            const weatherDescripton = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    
            console.log(weatherDescripton);
    
            res.write("<h1> The weather is currently : " + weatherDescripton + "</h1>");
            res.write("<h1>The temperature in london is " + temp + " degrees Celcius</h1>");
            res.write("<img src = " + imageURL + ">");
            res.send();
        });
    });

})










app.listen(3000, function() {
    console.log("Server running on port 3000");
});