const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    src: String,
    run_id: Number,
    username: String,
    created_at: Date,
    likes: {type: Array, "default": []},
    dislikes: {type: Array, "default": []},
})

module.exports = mongoose.model('Video', VideoSchema);
