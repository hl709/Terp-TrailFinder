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

// Connect mongoose client here. Do not call "mongoose.disconnect()" unless you're shutting the website down.
// Opening/closing connections are expensive operations and you don't need to close and open connections
// every time, especially inside routes which you'll call many times.
mongoose.connect(process.env.MONGO_CONNECTION_STRING);

/* Using Express */
const express = require("express");
const app = express();
let portNumber = 7003;
// const multer = require("multer"); /* Handles processing form data */

/* Body Parser */
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json(); // create application/json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
process.stdin.setEncoding("utf8"); // important
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
// const upload = multer();

/* Routes */
const saved = require("./routes/saved");
const suggestions = require("./routes/suggestions");
const Trail = require("./model/Trail.js");

app.use("/saved", saved);
app.use("/suggestions", suggestions);

app.post("/add-to-saved", (request, response) => {
    const json = request.body.saved; // Receiving the entire saved array from TrailCardContext.jsx
    const hasBeenSaved = request.body.hasBeenSaved;
    
    let trailArr = [];

    for (const id in json) {
        const trail = json[id];

        const trailObj = {
            name: trail.name,
            city: trail.city,
            state: trail.state,
            country: trail.country,
            description: trail.description,
            directions: trail.directions,
            activities: trail.activities
        };
                    
        trailArr.push(trailObj);
    }

    insertTrails(trailArr, hasBeenSaved);

    response.send(json);
});

async function insertTrails(trailArr, hasBeenSaved) {
    try {        
        if (hasBeenSaved == true) {
            // Iterate through trailArr ("saved" array from TrailCardContext) and upsert into database
            for (let i = 0; i < trailArr.length; i++) {
                let elm = trailArr[i];

                await Trail.updateOne(
                    { name: elm.name },
                    { $set:
                        {
                            city: elm.city,
                            state: elm.state,
                            country: elm.country,
                            description: elm.description,
                            directions: elm.directions,
                            activities: elm.activities
                        }
                    },
                    { upsert: true }
                );
            }
        } else { // hasBeenSaved == false
            // use find to get entire collection and turn this into an array (collectionArray) using find
            // loop through collectionArray and if a document in collectionArray is not in trailArr
            // then use the findOneAndDelete command to remove document from the database
            const collectionArray = await Trail.find({});

            for (let i = 0; i < collectionArray.length; i++) {
                let elm = collectionArray[i];
                let existsInTrailArr = trailArr.some(trail => trail.name === elm.name);

                if (existsInTrailArr == false) {
                    await Trail.deleteOne(
                        { name: elm.name }
                    );
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}

app.get("/processremoved", (request, response) => {
    removeAll();

    response.send("Success");
});

async function removeAll() {
    try {
        const result = await Trail.deleteMany({});

        return result;
    } catch (err) {
        console.error(err);
    }
}

app.listen(portNumber)
process.stdout.write(`Server started and running at http://localhost:${portNumber}\n`);
process.stdout.write("Stop to shutdown the server: ");