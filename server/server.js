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
// const multer = require("multer"); /* Handles processing form data */

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
// const upload = multer();

/* Routes */
const saved = require("./routes/saved");
const suggestions = require("./routes/suggestions");
const Trail = require("./model/Trail.js");

app.use("/saved", saved);
app.use("/suggestions", suggestions);

app.get("/processremoved", (request, response) => {
    removeAll();

    response.send("Success");
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