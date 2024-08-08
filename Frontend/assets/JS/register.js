const registerForm = document.querySelector("#register");
const nameInp = document.querySelector("#registerName");
const emailInp = document.querySelector("#registerEmail");
const passwordInp = document.querySelector("#registerPassword");

registerForm.addEventListener("submit", async function(e){
    e.preventDefault();
    let newUser = {
        name: nameInp.value,
        email: emailInp.value,
        password: passwordInp.value
    };

    try {
        let response = await axios.post("http://localhost:2121/users/register", newUser);
        console.log(response); // Sunucu yanıtını kontrol edin
    
        let token = response.headers["token"];
        console.log("Token:", token); // Token kontrolü
    
        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error("Registration failed", error);
        alert("Registration failed: " + (error.response.data.message || error.message));
    }
    
});

function tokenControlUI() {
    let token = localStorage.getItem("token");
    if (token) {
        window.location.href = "login.html";
    }
}

tokenControlUI();