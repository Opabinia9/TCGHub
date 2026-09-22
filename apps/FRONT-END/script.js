const loginButton = document.getElementById("login-button");
const createAccountButton = document.getElementById("create-account-button");
const card = document.querySelector(".card");

loginButton.addEventListener("click", (event) => {
    event.preventDefault();

    card.classList.add("flip");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 600);
});

createAccountButton.addEventListener("click", (event) => {
    event.preventDefault();

    card.classList.add("flip");

    setTimeout(() => {
        window.location.href = "create-account.html";
    }, 600);
});