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
            'x-rapidapi-key': process.env.RAPIDAPI_KEY_STRING,
            'x-rapidapi-host': 'trailapi-trailapi.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };
    
    const promise = await fetch(URL, OPTIONS);
    const json = await promise.json();

    return response.send(json);
});

module.exports = router;