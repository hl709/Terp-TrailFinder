const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const mongoose = require("mongoose");

const databaseName = "CMSC335DB";
const collectionName = "campApplicants";
const uri = process.env.MONGO_CONNECTION_STRING;

const bodyParser = require("body-parser");

// Using Express
const express = require("express");
const app = express();
let portNumber = 5001;

const favorites = require("./routes/favorites");
const suggestions = require("./routes/suggestions");
const current_trail = require("./routes/currentTrail.js");

app.use("/favorites", favorites);
app.use("/suggestions", suggestions);
app.use("/current-trail", current_trail);

/* Initializes request.body with post information */ 
app.use(bodyParser.urlencoded({extended: false}));

// Command Line Interpreter
process.stdin.setEncoding("utf8"); // Important

app.listen(portNumber)

process.stdout.write(`Web server started and running at http://localhost:${portNumber}\n`);
process.stdout.write("Stop to shutdown the server: ");

process.stdin.on('readable', () => { /* on equivalent to addEventListener */
    const dataInput = process.stdin.read();

    if (dataInput != null) {
        const command = dataInput.trim();

        if (command === "stop") {
            process.stdout.write("Shutting down the server\n");
            process.exit(0);
        }
    }
});

// Defining the view/templating engine to use
app.set("view engine", "ejs");

// Serve static files from the 'public' directory. Allows stylesheet to be used.
app.use(express.static('public'));

// Directory where templates will reside
app.set("views", path.resolve(__dirname, "webpages"));

// Displays home page of index.ejs
app.get("/", async (request, response) => {
    response.render("index");
});

app.post("/", async (request, response) => {
    const city = request.body.city;
    const country = request.body.country;
    const state = request.body.state_province;
    const activity = request.body.activity;

    const url = `https://trailapi-trailapi.p.rapidapi.com/activity/?lat=1&limit=5&lon=1&q-city_cont=${city}&q-country_cont=${country}&q-state_cont=${state}&radius=25&q-activities_activity_type_name_eq=${activity}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ce7d3eb001msh889da79cb4259cdp17eed4jsn5f04e454a884',
            'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        const resultString = JSON.stringify(json); // MUST EDIT STRING TO GET ARRAY
        const result = JSON.parse(resultString);

        // process.stdout.write(resultString);
        
        for (const id in result) {
            const trail = result[id];

            console.log("ID:", id);
            console.log("Name:", trail.name);
            console.log("City:", trail.city);
        }
    } catch (error) {
        console.error(error);
    }

    response.render("suggestions");
});