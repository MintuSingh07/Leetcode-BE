const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: String,
    description: String,
    kase: [{
        case: [{
            input: mongoose.Schema.Types.Mixed,
            output: mongoose.Schema.Types.Mixed
        }]
    }],
    category: String,
    mode: String,
    like: Number,
    dislike: Number,
    submit: [{
        code: String,
        attempt: Number,
        user: String
    }]
});


module.exports = mongoose.model("Questions", questionSchema);
