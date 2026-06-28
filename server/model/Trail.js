const mongoose = require("mongoose");

const trailSchema = new mongoose.Schema({
    name: String,
    city: String,
    state: String,
    country: String,
    description: String,
    directions: String,
    activities: mongoose.Schema.Types.Mixed
});

const Trail = mongoose.model("Trail", trailSchema);
module.exports = Trail;