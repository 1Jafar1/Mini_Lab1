const loginForm = document.querySelector("#login")
const emailInp = document.querySelector("#loginEmail")
const passwordInp= document.querySelector("#loginPassword")

loginForm.addEventListener('submit', async function(e){

    e.preventDefault()
    let User = {
        email: emailInp.value,
        password: passwordInp.value 
    }

    let response = await axios.post("http://localhost:2121/users/login",User)

    //let token = response.headers["auth-tokensss"]

    let token = response.data.token;

    if(token){
        //  localStorage.setItem("tokenzzz", token)
        window.location.href="product.html"
    }  
})



function tokenControlUI() {
    let tokend = localStorage.getItem("token")
    if(!tokend){
        window.location.href="register.html"
    }
}
tokenControlUI()

