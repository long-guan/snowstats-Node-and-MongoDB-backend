const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConditionSchema = new Schema({
    run_id: Number,
    username: String,
    snow_condition: {type: Array, "default": []},
    trail_feature: {type: Array, "default": []},
    date: Date,
    comment: String,
    created_at: Date,
})

module.exports = mongoose.model('Condition', ConditionSchema);
