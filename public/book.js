//HTML elements and Variables
let menu_button = document.getElementById("menu-toggle");
let menu_bar = document.getElementById("menu-wrapper")
let browse_tab = document.getElementById("browse-tab");
let library_tab = document.getElementById("library-tab");
let browse_label = document.getElementById("browse-label")
let library_label = document.getElementById("library-label")
let request_button = document.getElementById("request")
let log_out = document.getElementById("log-out")
let cover_image = document.getElementById("large-cover");
let title = document.getElementById("title-book")
let author = document.getElementById("author")
let owner = document.getElementById("owner")
let blurb = document.getElementById("blurb")

//Database functions
const updateBook = async (title, author, holder, username) => await (await fetch("/updateBook", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({title, author, holder, username}),})).json()

//Gets book info from storage
const title_text = localStorage.getItem("title")
const author_text = localStorage.getItem("author")
const owner_text = localStorage.getItem("holder")
const blurb_text = localStorage.getItem("blurb")
const image_src = localStorage.getItem("image")
const requestedby = localStorage.getItem("requestedby")
const username = localStorage.getItem("username")

//Updates text on page using book info
title.textContent = "Title: " + title_text
author.textContent = "Author: " + author_text
owner.textContent = "Owner: " + owner_text
blurb.textContent = "Blurb: " + blurb_text
cover_image.src = image_src

//Sets request button text to "request", "requested", or "owned"
request_button.textContent = "Request"
request_button.disabled = false;
if (requestedby == username){
    request_button.textContent = "Requested"
    request_button.disabled = true
}else if (owner_text == username){
    request_button.textContent = "Owned"
    request_button.disabled = true
}else if (requestedby != ""){
    request_button.textContent = "Unavailable"
    request_button.disabled = true
}

//Event Listener for Menu toggle
menu_button.addEventListener("click", () => {
    if (open){
        menu_bar.style.width = "5%";
        browse_tab.style.visibility="hidden";
        library_tab.style.background="#421220";
        browse_label.style.color="#421220";
        library_tab.style.visibility="hidden";
        open = false
    } else{
        menu_bar.style.width = "15%";
        browse_tab.style.visibility="visible";
        library_tab.style.background="#ffe8ef"
        library_tab.style.visibility="visible";
        browse_label.style.color="#ffe8ef"
        open = true;
    }
    
})

//Event Listener for Menu Tabs and Log Out
browse_tab.addEventListener("click", ()=>{
    window.location.href = "browse.html"
})

library_tab.addEventListener("click", ()=>{
    window.location.href = "my-library.html"
})

log_out.addEventListener("click", ()=> {
    window.location.href = "index.html"
})

//Event Listener for Request button. Updates request button and requestedby of book.
request_button.addEventListener("click", async () => {
    if (requestedby == ""){
        newbook = await updateBook(title_text, author_text, owner_text, username)
        request_button.textContent = "Requested"
        request_button.disabled = true
    }
})


