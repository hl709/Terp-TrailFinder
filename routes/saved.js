const path = require("path");
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const mongoose = require("mongoose");

const express = require('express');
const router = express.Router();

const Trail = require("../model/Trail.js");

router.get("/", async (request, response) => {
    let trails = await getTrails();
    let contentTemplate = ``;

    for (let i = 0; i < trails.length; i++) {
        let trail = trails[i];

        contentTemplate += `
            <div class="trailContent">
                <p>Name: ${trail.name}</p>
                <p>City: ${trail.city}</p>
                <p>State: ${trail.state}</p>
                <p>Country: ${trail.country}</p>
            </div>
        `;
    }

    const variables = {
        content: contentTemplate
    };

    response.render("saved", variables);
});

async function getTrails() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

        const trails = await Trail.find({});

        mongoose.disconnect();

        return trails;
    } catch (err) {
        console.error(err);
    }
}

router.post("/", (request, response) => {
    removeAll();

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

module.exports = router;