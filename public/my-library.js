//HTML Elements/Variables
let menu_button = document.getElementById("menu-toggle");
let menu_bar = document.getElementById("menu-wrapper")
let browse_tab = document.getElementById("browse-tab");
let library_tab = document.getElementById("library-tab");
let browse_label = document.getElementById("browse-label")
let my_books = document.getElementById("my-books")
let my_requests = document.getElementById("my-requests")
let open = true;
let log_out = document.getElementById("log-out")
let add_button = document.getElementById("add")
let title_input = document.getElementById("add-title")
let author_input = document.getElementById("add-author")

//Book API Info
const bookAPIURL_start = "https://openlibrary.org/search.json?title="
const bookAPIURL_end = "&lang=en&fields=key,title,editions,first_sentence&limit=1"
const coverAPIURL = "https://covers.openlibrary.org/b/olid/"
const user_header = "BookExchange/1.0 (tavisha_patel@berkeley.edu)"

//Database Functions
const getBooks = async () => await (await fetch(`/books`, {})).json()
const removeBook = async (title, author, holder) => await (await fetch("/removeBook", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({title, author, holder}),})).json()
const addBook = async (title, author, holder, requestedby, image, blurb) => await (await fetch("/newBook", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({title, author, holder, requestedby, image, blurb}),})).json()
const changeRequestedby = async (title, author, holder, username) => await (await fetch("/updateBook", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({title, author, holder, username}),})).json()
const acceptRequest = async(title, author, holder, newHolder) => await (await fetch("/updateHolder", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({title, author, holder, newHolder}),})).json()

//Gets username from storage
let username = localStorage.getItem("username")

//API Functions
const findBook = async (url) => await (await fetch(url, {method: 'GET', headers: {"User-Agent": user_header}})).json()
const findImage = async(bookID) => (await fetch(coverAPIURL + bookID + "-M.jpg", {method: 'GET', headers: {"User-Agent": user_header}})).url

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

//Event Listeners for Menu Tabs/Log Out
browse_tab.addEventListener("click", ()=>{
    window.location.href = "browse.html"
})

log_out.addEventListener("click", ()=> {
    window.location.href = "index.html"
})


//createMyBook: Creates and new HTML elements for a book in my-library section.
//Parameters: book (a Book object, from bookSchema in database.js)
function createMyBook(book){
    let new_card = document.createElement("div")
    new_card.classList.add("card")
    let cover_image= document.createElement("img");
    cover_image.classList.add("cover-image");
    cover_image.src = book.image;
    //Event Listener for each cover-image that stores data about the book and takes user to book page
    cover_image.addEventListener("click", ()=>{
        localStorage.setItem("title", book.title)
        localStorage.setItem("author", book.author)
        localStorage.setItem("image", book.image)
        localStorage.setItem("holder", book.holder)
        localStorage.setItem("blurb", book.blurb)
        localStorage.setItem("requestedby", book.requestedby)
        window.location.href = "book.html"
    });
    let title_name = document.createElement("p")
    title_name.textContent = book.title
    title_name.classList.add("title-text")
    let author_name= document.createElement("p")
    author_name.textContent = book.author
    author_name.classList.add("author-text")
    let remove_button = document.createElement("button")
    remove_button.classList.add("remove-button")
    remove_button.textContent = "Remove"
    //Event Listener for remove button for each book. Removes book from my library and database
    remove_button.addEventListener("click", async ()=> {
        let removed = await removeBook(title_name.textContent, author_name.textContent, username)
        removeMyBook(removed)
        removeRequest(removed)
    })
    new_card.appendChild(cover_image);
    new_card.appendChild(title_name);
    new_card.appendChild(author_name);
    new_card.appendChild(remove_button)
    my_books.prepend(new_card);
}

//removeMyBook: searches through all book cards in my library section and removes book card of the given object from the page.
//Paramters: removed (a Book object)
function removeMyBook(removed){
    for (card of my_books.children){
        let title_found = false;
        let author_found = false;
        for (el of card.children){
            if (el.className == "title-text" && el.textContent == removed.title){
                title_found = true;
            }
            if (el.className == "author-text" && el.textContent == removed.author){
                author_found = true;
            }
        }
        if (title_found && author_found){
            my_books.removeChild(card)
        }
    }
}

//createRequest: creates request card for given book and adds it to the page.
//Parameters: book (a Book Object)
function createRequest(book){
    //Adds div and image to page
    let request = document.createElement("div")
    request.classList.add("request-card")
    let book_card= document.createElement("div")
    book_card.classList.add("small-card")
    let cover_image = document.createElement("img")
    cover_image.src = book.image
    cover_image.classList.add("small-image")
    book_card.appendChild(cover_image)
    request.appendChild(book_card)

    //Adds text to div
    let text_div = document.createElement("div")
    text_div.classList.add("text")
    request.appendChild(text_div)
    let title = document.createElement("h4")
    title.textContent = "Title: " + book.title
    title.classList.add("title-text")
    text_div.appendChild(title)
    let requester = document.createElement("h4")
    requester.textContent = "Request From: " + book.requestedby
    requester.classList.add("requester-text")
    text_div.appendChild(requester)

    //Adds accept button to div
    let button_div = document.createElement("div")
    button_div.classList.add("button-div")
    check_button = document.createElement("button")
    check_button.classList.add("check-button")
    check_button.textContent = "✓"

    //Event Listener for check button. Changes holder of book, clears requestedby, and removes request card and book card from page.
    check_button.addEventListener("click", async() =>{
        let accepted = await acceptRequest(book.title, book.author, book.holder, book.requestedby)
        removeRequest(accepted);
        removeMyBook(accepted)
    });

    button_div.appendChild(check_button)

    //Adds reject button to div
    x_button = document.createElement("button")
    x_button.classList.add("x-button")
    x_button.textContent = "✕"

    //Event Listener for x button. Clears requestedby and removes request card and book card from page.
    x_button.addEventListener("click", async () => {
        let rejected = await changeRequestedby(book.title, book.author, book.holder, "")
        removeRequest(rejected)
    });

    button_div.appendChild(x_button)
    text_div.appendChild(button_div)
    my_requests.appendChild(request)
}

//removeRequest: removes request card for given book from the page
//Parameters: book (a Book Object)
function removeRequest(book){
    for (request of my_requests.children){
        let title_found = false;
        let requester_found = false;
        for (el of request.children){
            if (el.className == "text"){
                for (text of el.children){
                    if (text.className == "title-text" && text.textContent == "Title: " + book.title){
                        title_found = true;
                    }
                    if (text.className == "requester-text" && text.textContent == "Request From: " + book.requestedby){
                        requester_found = true;
                    }
                }
            }     
        }
        if (title_found && requester_found){
            my_requests.removeChild(request)
        }
    }  
}

//Displays all of the user's current books when the page is first loaded
async function showMyBooks(){
    const my_book_list = await getBooks();
    for (i in my_book_list){
        let book = my_book_list[i]
        if (book.holder == username){
            createMyBook(book)
            if (book.requestedby != ""){
                createRequest(book)
            }
        } 
    }
}

//Add Book Button Event Listener
add_button.addEventListener("click", async () =>{
    let title_val = title_input.value.trim();
    let author_val = author_input.value.trim();
    if (title_val == "" || author_val == ""){
        title_input.placeholder = "Please enter a title."
        author_input.placeholder = "Please enter an author."
        return
    }
    let holder = username;
    let requestedby = "";

    //Gets image and blurb from API
    let formatted_bookURL = bookAPIURL_start + title_val + "&author=" + author_val + bookAPIURL_end;
    let found_books = await findBook(formatted_bookURL);
    let found_image = "image.png"
    let blurb = "No blurb found."
        try{
            let bookID = (found_books.docs[0].editions.docs[0].key).slice(7)
            found_image = String(await findImage(bookID))
            blurb = String(found_books.docs[0].first_sentence[0])  
            if (blurb == "undefined"){
                blurb = "No blurb found."
            }
        } catch (error){
            
        }

    //Adds book to database
    let new_book = await addBook(title_val, author_val, holder, requestedby, found_image, blurb);

    title_input.value = ""
    author_input.value = ""
    title_input.placeholder = "Enter Title"
    author_input.placeholder = "Enter Author"
    createMyBook(new_book)
});


showMyBooks();

