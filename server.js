const path = require("path");
// require("dotenv").config({
//    path: path.resolve(__dirname, ".env"),
// });

const mongoose = require("mongoose");

const databaseName = "CMSC335DB";
const collectionName = "trailCollection";
const uri = process.env.MONGO_CONNECTION_STRING;

const bodyParser = require("body-parser");

// Using Express
const express = require("express");
const app = express();
let portNumber = 5001;

const saved = require("./routes/saved.js");
const suggestions = require("./routes/suggestions");
const current_trail = require("./routes/currentTrail.js");
const Trail = require("./model/Trail.js");

app.use("/saved", saved);
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
    let contentTemplate = ``;
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
        const promise = await fetch(url, options);
        const json = await promise.json();
        const resultString = JSON.stringify(json);
        const result = JSON.parse(resultString);

        // process.stdout.write(resultString);
        
        if (result.hasOwnProperty("code")) {
            return response.send("No results");
        } else {
            let trailArr = [];

            for (const id in result) {
                const trail = result[id];
                
                contentTemplate += `
                    <div class="trailContent">
                        <p>Name: ${trail.name}</p>
                        <p>City: ${trail.city}</p>
                        <p>State: ${trail.state}</p>
                        <p>Country: ${trail.country}</p>
                    </div>
                `;

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
    } catch (error) {
        console.error(error);
    }

    const variables = {
        content: contentTemplate
    }

    response.render("suggestions", variables);
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