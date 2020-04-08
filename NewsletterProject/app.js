const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members : [
        {
            email_address : email,
            status : "subscribed", 
            merge_fields : {
                FNAME : firstName, 
                LNAME : lastName
            }
        }
        ]
    };

    const jsonData = JSON.stringify(data);


    const url = "https://us19.api.mailchimp.com/3.0/lists/cd63e348ab/";

    const options = {
        method:"POST",
        auth:"saikrishna1207:501c1f976fa0cec6e9506877cd0f3de0-us19"
    };

    const request = https.request(url, options, function(response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
            console.log("Hi veer");
        }
            response.on("data", function(data) {
                console.log(JSON.parse(data));
            }
        )
   
    });
    request.write(jsonData);
    request.end();
   
});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});



//API KEY : d4746c33f2b33d98ee0d36b41276925b-us19
//list id ; cd63e348ab
//501c1f976fa0cec6e9506877cd0f3de0-us19