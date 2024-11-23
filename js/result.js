document.addEventListener("DOMContentLoaded", () => {
    const retryButton = document.getElementById("retryButton");
    const nextGameButton = document.getElementById("nextGameButton");
    const resultMessage = document.getElementById("resultMessage");
    const resultLevel = document.getElementById("resultLevel");
    const resultTimer = document.getElementById("resultTimer");

    // URL에서 쿼리 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level");
    const time = urlParams.get("time");
    const imageIndex = urlParams.get("imageIndex"); // 기본값 설정 제거

    // 결과 화면 업데이트
    resultLevel.textContent = `Level ${level}`;
    resultTimer.textContent = time;
    resultMessage.textContent = urlParams.get("result") === "success" ? "You Win!" : "Game Over";

   // Retry 버튼 동작
    retryButton.addEventListener("click", () => {
        if (level) {
            // imageIndex가 명확히 null 또는 undefined인 경우를 제외하고는 그대로 사용
            const retryImageIndex = imageIndex !== null && imageIndex !== "null"
                ? imageIndex // 마지막 사용된 이미지 유지
                : 0; // 기본값 설정 (원하는 기본값으로 변경 가능)

            console.log(`Retry 경로: ./GameView.html?level=${level}&imageIndex=${retryImageIndex}`);
            window.location.href = `./GameView.html?level=${level}&imageIndex=${retryImageIndex}`;
        } else {
            console.error("레벨 정보가 없습니다!");
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

            window.location.href = `./GameView.html?level=${level}&imageIndex=${newImageIndex}`;
        } else {
            console.error("레벨 파라미터가 누락되었습니다.");
        }
    });
});

function goToMenu() {
    window.location.href = "./level.html";
}