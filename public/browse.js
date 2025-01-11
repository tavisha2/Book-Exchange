//HTML Elements/Variables
let menu_button = document.getElementById("menu-toggle");
let menu_bar = document.getElementById("menu-wrapper")
let browse_tab = document.getElementById("browse-tab");
let library_tab = document.getElementById("library-tab");
let book_cards = document.getElementById("cards")
let library_label = document.getElementById("library-label")
let log_out = document.getElementById("log-out")
let search_button = document.getElementById("search-button")
let search_input = document.getElementById("search-bar")
let open = true;

let username = localStorage.getItem("username");

//Database Functions
const getSearchBooks = async (title) => await (await fetch(`/books/${title}`, {})).json();
const getRequestedBooks = async (requestedby) =>  await (await fetch(`/books/search/${requestedby}`, {})).json();
const getBooks = async () => await (await fetch(`/books`, {})).json();

//Menu Toggle Event Listener
menu_button.addEventListener("click", () => {
    if (open){
        menu_bar.style.width = "5%";
        browse_tab.style.visibility="hidden";
        browse_tab.style.background="#421220";
        //browse_tab.style.color="#421220";
        library_label.style.color="#421220";
        library_tab.style.visibility="hidden";
        open = false
    } else{
        menu_bar.style.width = "15%";
        browse_tab.style.visibility="visible";
        browse_tab.style.background="#ffe8ef"
        library_tab.style.visibility="visible";
        library_label.style.color="#ffe8ef"
        open = true;
    } 
})

//Menu Tabs/Log Out Event Listeners
library_tab.addEventListener("click", ()=>{
    window.location.href = "my-library.html"
})

log_out.addEventListener("click", ()=> {
    window.location.href = "index.html"
})


//createBook: Creates and new HTML elements for a book in browse section.
//Parameters: book (a Book object, from bookSchema in database.js)
function createBook(book){
    let new_card = document.createElement("div")
    new_card.classList.add("card")
    let cover_image= document.createElement("img");
    cover_image.classList.add("cover-image");
    cover_image.src = book.image;
    let title_name = document.createElement("p")
    title_name.style.fontSize = "16px"
    title_name.style.fontWeight = "600"
    title_name.textContent = book.title
    let author_name= document.createElement("p")
    author_name.textContent = book.author
    new_card.appendChild(cover_image);
    new_card.appendChild(title_name);
    new_card.appendChild(author_name);
    //Event Listener for each cover image that stores data about the book and takes user to book page
    cover_image.addEventListener("click", ()=>{
        localStorage.setItem("title", book.title)
        localStorage.setItem("author", book.author)
        localStorage.setItem("image", book.image)
        localStorage.setItem("holder", book.holder)
        localStorage.setItem("blurb", book.blurb)
        localStorage.setItem("requestedby", book.requestedby)
        window.location.href = "book.html"
    })
    book_cards.appendChild(new_card);
}

//update: Fills the page with the books in the given list using createBook
//Paramters: list (list of Book objects, default is empty list)
async function update(list = []) {
    //If list is not empty, displays books in given list
    if (list.length != 0){
        for (book of list){
            createBook(book)
        }
    //If list is empty, gets all books from database and displays them
    }else{
        let book_list = await getBooks();
        for (book of book_list){
            createBook(book)
        }
    }
}

//clearBooks: clears all books from the page
function clearBooks(){
    while (book_cards.lastChild){
        book_cards.removeChild(book_cards.lastChild)
    }
}

//Event listener for Search Button
//gets text from search input, gets relevant books from database, clears books, and displays the search results
search_button.addEventListener("click", async () => {
    let input_text = search_input.value
    let title_list = []

    if (input_text.toLowerCase() == "requested"){
        title_list = await getRequestedBooks(username)
    } else if (input_text.toLowerCase() == "available"){
        title_list = await getRequestedBooks("-")
    }else{
        title_list = await getSearchBooks(input_text)
    }
    clearBooks();
    if (title_list.length == 0){
        let none_found = document.createElement("p")
        none_found.style.margin = "25px"
        none_found.textContent = "No Books Found"
        book_cards.appendChild(none_found)
    }else{
        update(title_list)
    }
})

//Displays all books in database when page is first loaded
update();
