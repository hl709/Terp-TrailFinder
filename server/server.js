"use strict";

const path = require("path");

/* Comment out when deploying */
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

/* MongoDB database */
const mongoose = require("mongoose");
const databaseName = "CMSC335DB";
const collectionName = "trailCollection";
const uri = process.env.MONGO_CONNECTION_STRING;

/* Using Express */
const express = require("express");
const app = express();
let portNumber = 5001;
const multer = require("multer"); /* Handles processing form data */

/* Body Parser */
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
process.stdin.setEncoding("utf8");
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

/* CORS */
const cors = require("cors");
app.use(cors()); /* Allows all origins to access the server */
app.use(express.json());
const upload = multer();

/* Routes */
const saved = require("./routes/saved");
const suggestions = require("./routes/suggestions");
const Trail = require("./model/Trail.js");

app.use("/saved", saved);
app.use("/suggestions", suggestions);

// Displays home page of index.ejs
app.get("/", async (request, response) => {
    response.render("index");
});

app.post("/suggestions", upload.none(), async (request, response) => {
    let contentTemplate = ``;
    const city = request.body.city;
    const country = request.body.country;
    const state = request.body.state;
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

    response.send(`YES: ${request.country}, ${request.state}, ${request.city}, ${request.activity}`);
});

async function insertTrails(trailArr) {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        for (let i = 0; i < trailArr.length; i++) {
            let elm = trailArr[i];

            const trail = new Trail({
                id: elm.id,
                name: elm.name,
                city: elm.city,
                state: elm.state,
                country: elm.country
            });

            await trail.save();
        }

        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

app.listen(portNumber)
process.stdout.write(`Server started and running at http://localhost:${portNumber}\n`);
process.stdout.write("Stop to shutdown the server: ");