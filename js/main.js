document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.querySelector(".game-button");
    const helpButton = document.querySelector(".help-button");
    const buttonContainer = document.querySelector(".button-container");

    // "Play Game" 버튼 클릭 시 레벨 선택 화면 전환
    playButton.addEventListener("click", function () {
        // 버튼 텍스트 및 동작 업데이트
        playButton.textContent = "Level 1 (2 X 2)";
        playButton.onclick = () => window.location.href = "GameView.html?level=1";

        helpButton.textContent = "Level 2 (3 X 3)";
        helpButton.onclick = () => window.location.href = "GameView.html?level=2";

        // Level 3 버튼 생성
        const level3Button = document.createElement("button");
        level3Button.className = "game-button";
        level3Button.textContent = "Level 3 (4 X 4)";
        level3Button.onclick = () => window.location.href = "GameView.html?level=3";

        // 버튼 컨테이너에 추가
        buttonContainer.appendChild(level3Button);
    });
    
    // "Help" 버튼 클릭 시 Help.html로 이동
    helpButton.addEventListener("click", function () {
        window.location.href = "Help.html";
    });
});