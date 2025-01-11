const express = require("express");
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const bodyParser = require("body-parser");
const {User, Book, connectToDB} = require("./database");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"));

//Creates new user with username and password and adds to database
app.post("/newUser", asyncHandler(async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const newUser= new User({username, password});
    await newUser.save()
    res.json(newUser)
}));

//Gets password for a given user
app.get("/password/:username", asyncHandler(async (req, res) => {
    const username = req.params.username;
    const foundUser = await User.find({username: username})
    res.json(foundUser)
}));

//Gets all books
app.get("/books", asyncHandler(async (req, res) => {
    const bookList = await Book.find()
    res.json(bookList);
}));

//Gets all books with given title
app.get("/books/:title", asyncHandler(async (req, res) => {
    const bookListTitle = await Book.find({title: req.params.title})
    res.json(bookListTitle);
}));

app.get("/books/search/:requestedby", asyncHandler(async (req, res) => {
    let bookListRequested = []
    if (req.params.requestedby == "-"){
        bookListRequested = await Book.find({requestedby: ""})
    } else{
        bookListRequested = await Book.find({requestedby: req.params.requestedby})
    }
    res.json(bookListRequested);
}));

//Creates a new book with title, author, holder, requestedby, image, and blurb and adds to database
app.post("/newBook", asyncHandler(async (req, res) =>{
    const title = req.body.title;
    const author = req.body.author;
    const holder = req.body.holder;
    const requestedby = req.body.requestedby;
    const image = req.body.image; 
    const blurb = req.body.blurb;
    const newBook = new Book({title: title, author: author, holder: holder, requestedby: requestedby, image: image, blurb: blurb});
    await newBook.save();
    res.json(newBook)
}));

//removes book with given title, author, and holder from database
app.post("/removeBook", asyncHandler(async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const holder = req.body.holder;
    const deletedBook = await Book.findOneAndDelete({title: title, author: author, holder: holder});
    res.json(deletedBook)
}));

//updates username of book with given username, title, author, and holder
app.post("/updateBook", asyncHandler(async (req, res) =>{
    const username = req.body.username
    const title = req.body.title
    const author = req.body.author
    const holder = req.body.holder
    const updatedBook = await Book.findOneAndUpdate({title: title, author: author, holder: holder}, {requestedby: username})
    await updatedBook.save();
    res.json(updatedBook);

}));

//updates holder of book with given title, author, and holder
app.post("/updateHolder", asyncHandler(async (req, res) => {
    const newHolder = req.body.newHolder
    const title = req.body.title
    const author = req.body.author
    const holder = req.body.holder
    const updatedBook = await Book.findOneAndUpdate({title:title, author:author, holder:holder}, {holder:newHolder, requestedby: ""})
    await updatedBook.save();
    res.json(updatedBook);
}));
 

async function start() {
    await connectToDB();

    return app.listen(3000, () => {
    });
}

start();