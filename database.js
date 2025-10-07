const mongoose = require("mongoose");
const dbConnectionUri = "###";
const dbName = "bookwebsite";

//Connects to database
async function connectToDB() {
    await mongoose.connect(dbConnectionUri, {dbName});
    console.log("Connected")
}

//Schema for user
const userSchema = new mongoose.Schema({
    username:String,
    password:String
});

//Schema for book
const bookSchema = new mongoose.Schema({
    title: String, 
    author: String, 
    holder: String, 
    requestedby: String,
    image: String,
    blurb: String
});

const User = mongoose.model("User", userSchema);
const Book = mongoose.model("Book", bookSchema);


module.exports = {User, Book, connectToDB};
