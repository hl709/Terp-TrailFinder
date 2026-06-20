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
let portNumber = 7003;
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

app.get("/suggestions", async (request, response) => {
    const URL = `https://trailapi-trailapi.p.rapidapi.com/activity/?lat=1&limit=5&lon=1&q-city_cont=${request.query.city}&q-country_cont=${request.query.country}&q-state_cont=${request.query.state}&radius=25&q-activities_activity_type_name_eq=${request.query.activity}`;
    const OPTIONS = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ce7d3eb001msh889da79cb4259cdp17eed4jsn5f04e454a884',
            'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    
    const promise = await fetch(URL, OPTIONS);
    const json = await promise.json();

    if (!json.hasOwnProperty("code")) {
        let trailArr = [];

        for (const id in json) {
            const trail = json[id];

            const trailObj = {
                name: trail.name,
                city: trail.city,
                state: trail.state,
                country: trail.country
            };
                    
            trailArr.push(trailObj);
        }

        insertTrails(trailArr);
    }

    return response.send(json);
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

router.get("/processremoved", (request, response) => {
    removeAll();
    console.log("HERE");

    response.redirect("/");
});

async function removeAll() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        const result = await Trail.deleteMany({});

        mongoose.disconnect();

        return result;
    } catch (err) {
        console.error(err);
    }
}

app.listen(portNumber)
process.stdout.write(`Server started and running at http://localhost:${portNumber}\n`);
process.stdout.write("Stop to shutdown the server: ");