document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector(".button-container");

    const button = document.createElement("button");
    button.className = "game-button";
    button.textContent = "start";
    button.onclick = () => window.location.href = "level.html";

    buttonContainer.appendChild(button);
});