const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    email : String,
    username : String,
    password : String
})

module.exports = mongoose.model("account", Schema);
