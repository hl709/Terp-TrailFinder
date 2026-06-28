const path = require("path");

/* Comment out when deploying */
require("dotenv").config({
   path: path.resolve(__dirname, ".env"),
});

const mongoose = require('mongoose');

const express = require('express');
const router = express.Router();

const Trail = require("../model/Trail.js");

router.get("/", async (request, response) => {
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
                country: trail.country,
                description: trail.description,
                directions: trail.directions,
                activities: trail.activities
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
                country: elm.country,
                description: elm.description,
                directions: elm.directions,
                activities: elm.activities
            });

            await trail.save();
        }

        mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}

module.exports = router;