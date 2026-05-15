const mongoose = require("mongoose");

const trailSchema = new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    country: String
});

const Trail = mongoose.model("Trail", trailSchema);
module.exports = Trail;