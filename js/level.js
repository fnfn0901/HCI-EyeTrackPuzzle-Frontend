document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector(".button-container");

    // 레벨 버튼 생성 및 추가
    const levels = [
        { text: "Level 1 (2 X 2)", href: "GameView.html?level=1" },
        { text: "Level 2 (3 X 3)", href: "GameView.html?level=2" },
        { text: "Level 3 (4 X 4)", href: "GameView.html?level=3" },
    ];

    levels.forEach(level => {
        const button = document.createElement("button");
        button.className = "game-button";
        button.textContent = level.text;
        button.onclick = () => window.location.href = level.href;
        buttonContainer.appendChild(button);
    });
});