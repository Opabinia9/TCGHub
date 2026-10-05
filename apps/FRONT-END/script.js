const loginButton = document.getElementById("login-button");
const createAccountButton = document.getElementById("create-account-button");
const card = document.querySelector(".card");

if (loginButton && card) {
loginButton.addEventListener("click", (event) => {
event.preventDefault();

    card.classList.add("flip");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 600);
});

}

if (createAccountButton && card) {
createAccountButton.addEventListener("click", (event) => {
event.preventDefault();

    card.classList.add("flip");

    setTimeout(() => {
        window.location.href = "create-account.html";
    }, 600);
});

}

/* CARD ACTIONS */

const cardButtons = document.querySelectorAll(".card-actions button");

cardButtons.forEach((button) => {
button.addEventListener("click", () => {

    if (button.textContent.includes("Deck")) {
        showMessage("Card added to your deck");
    } else {
        showMessage("Card added to your collection");
    }

});

});

/* SUCCESS MESSAGE */

function showMessage(message) {

const existingMessage = document.querySelector(".success-message");

if (existingMessage) {
    existingMessage.remove();
}

const successMessage = document.createElement("div");

successMessage.className = "success-message";

successMessage.innerHTML = `
    <span>✓</span>
    <p>${message}</p>
`;

document.body.appendChild(successMessage);

setTimeout(() => {
    successMessage.classList.add("show");
}, 10);

setTimeout(() => {
    successMessage.classList.remove("show");

    setTimeout(() => {
        successMessage.remove();
    }, 300);

}, 2500);

}