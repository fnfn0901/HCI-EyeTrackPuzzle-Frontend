document.addEventListener("DOMContentLoaded", () => {
    const retryButton = document.getElementById("retryButton");
    const nextGameButton = document.getElementById("nextGameButton");
    const chooseLevelButton = document.getElementById("chooseLevelButton");
    const resultMessage = document.getElementById("resultMessage");
    const resultLevel = document.getElementById("resultLevel");
    const resultTimer = document.getElementById("resultTimer");

    // URL에서 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level");
    const time = urlParams.get("time");
    const imageIndex = urlParams.get("imageIndex"); // 마지막 사용 이미지 인덱스

    // 결과 화면 업데이트
    resultLevel.textContent = `Level ${level}`;
    resultTimer.textContent = time;
    resultMessage.textContent = urlParams.get("result") === "success" ? "You Win!" : "Game Over";

    // Retry 버튼 동작
    retryButton.addEventListener("click", () => {
        if (level && imageIndex) {
            window.location.href = `gameview.html?level=${level}&imageIndex=${imageIndex}`;
        }
    });

    // Next Game 버튼 동작
    nextGameButton.addEventListener("click", () => {
        if (level) {
            const totalImages = 3; // 이미지 개수
            let newImageIndex = Math.floor(Math.random() * totalImages);

            // 마지막 이미지 제외 로직
            while (newImageIndex.toString() === imageIndex) {
                newImageIndex = Math.floor(Math.random() * totalImages);
            }

            window.location.href = `gameview.html?level=${level}&imageIndex=${newImageIndex}`;
        }
    });

    // Choose Level 버튼 동작
    chooseLevelButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});

function goToMenu() {
    window.location.href = "index.html";
}