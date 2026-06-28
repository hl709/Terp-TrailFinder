const path = require("path");

/* Comment out when deploying */
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const mongoose = require("mongoose");

const express = require('express');
const router = express.Router();

const Trail = require("../model/Trail.js");

router.get("/", async (request, response) => {
    let trails = await getTrails(); // Returns an array of trails from DB
    let trailArr = [];

    for (let i = 0; i < trails.length; i++) {
        let trail = trails[i];

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

    let toJSONArrStr = JSON.stringify(trailArr);
    let JSONArr = JSON.parse(toJSONArrStr);

    return response.send(JSONArr);
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

module.exports = router;