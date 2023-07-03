const mongoose = require("mongoose");
const env = require("./environment");
mongoose.connect(`${env.db}`);
const db = mongoose.connection;

//If error connecting mongodb
db.on("error", console.error.bind(console, "Error connecting db"));

//Once databse is open and connected
db.once("open", () => console.log(`Connected to db ${db.name}`));
module.exports = db;
