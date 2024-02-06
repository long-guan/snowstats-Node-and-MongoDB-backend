const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RunSchema = new Schema({
    id: Number,
    title: String,
    category: String,
});

module.exports = mongoose.model('Run', RunSchema);
