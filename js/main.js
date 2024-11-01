// 버튼 클릭 이벤트 리스너 설정
document.addEventListener("DOMContentLoaded", function() {
    const playButton = document.querySelector(".game-button");
    const helpButton = document.querySelector(".help-button");

    // "Play Game" 버튼 클릭 시 GameView로 이동
    playButton.addEventListener("click", function() {
        window.location.href = "gameview.html"; // GameView.html 파일로 이동
    });

    // "Help" 버튼 클릭 시 Help 페이지로 이동
    helpButton.addEventListener("click", function() {
        window.location.href = "help.html"; // Help.html 파일로 이동
    });
});