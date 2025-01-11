//Clears stored information
localStorage.clear();

//HTML Elements
let login = document.getElementById("sign-in")
let user_input = document.getElementById("username")
let pass_input = document.getElementById("password")
pass_input.placeholder = ""

//Database Functions
const addUser = async (username, password) => await (await fetch("/newUser", {method: "POST", headers: {"Content-Type": "application/json",}, body: JSON.stringify({username, password}),})).json()
const getUser = async (username) => await (await fetch(`/password/${username}`, {})).json()

//Login Button Event Listener
login.addEventListener("click", async () => {
    const input_name = user_input.value.trim()
    const input_pass = pass_input.value.trim()

    //Gets user associated with entered username from database
    foundUser = await getUser(input_name)
    console.log(foundUser);
    
    //Checking input username and password
    if (input_name == "" || input_pass == ""){
        console.log("user not found")
    } 
    else if (!foundUser[0]){
        await addUser(input_name, input_pass)
        localStorage.setItem("username", input_name)
        window.location = "browse.html"
        console.log("user added")
    } else if (foundUser[0].password == input_pass){
        window.location.href = "browse.html"
        localStorage.setItem("username", input_name)
        console.log("logged in!")
    } else{
        pass_input.value = ""
        pass_input.placeholder = "Wrong Password"
    }
  
});