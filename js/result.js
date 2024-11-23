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
    const imageIndex = urlParams.get("imageIndex");
    const imagePool = JSON.parse(sessionStorage.getItem("imagePool")) || [];

    // 결과 화면 업데이트
    resultLevel.textContent = `Level ${level}`;
    resultTimer.textContent = time;
    resultMessage.textContent = urlParams.get("result") === "success" ? "You Win!" : "Game Over";

    // Retry 버튼 동작
    retryButton.addEventListener("click", () => {
        if (level) {
            // imageIndex가 유효하면 그대로 사용
            const retryImageIndex = imageIndex !== null && imageIndex !== "null" 
                ? imageIndex 
                : Math.floor(Math.random() * imagePool.length); // 이미지가 없는 경우 랜덤 선택

            // GameView로 이동
            window.location.href = `./GameView.html?level=${level}&imageIndex=${retryImageIndex}`;
        } else {
            console.error("레벨 정보가 없습니다!");
        }
    });

    // Next Game 버튼 동작
    nextGameButton.addEventListener("click", () => {
        if (level) {
            const totalImages = imagePool.length;

            // sessionStorage에서 방문한 이미지 목록 가져오기
            let viewedImages = JSON.parse(sessionStorage.getItem('viewedImages')) || [];

            // 방문하지 않은 이미지 목록 필터링
            const unviewedImages = imagePool.filter((_, index) => !viewedImages.includes(index));

            // 모든 이미지를 본 경우, 기록 초기화
            if (unviewedImages.length === 0) {
                console.log("모든 이미지를 보았습니다. 기록을 초기화합니다.");
                sessionStorage.removeItem('viewedImages');
                viewedImages = [];
            }

            // 방문하지 않은 이미지에서 랜덤 선택
            const newImageIndex = unviewedImages.length > 0
                ? imagePool.indexOf(unviewedImages[Math.floor(Math.random() * unviewedImages.length)])
                : Math.floor(Math.random() * totalImages);

            // 선택한 이미지를 기록에 추가
            if (!viewedImages.includes(newImageIndex)) {
                viewedImages.push(newImageIndex);
                sessionStorage.setItem('viewedImages', JSON.stringify(viewedImages));
            }

            // GameView로 이동
            window.location.href = `./GameView.html?level=${level}&imageIndex=${newImageIndex}`;
        } else {
            console.error("레벨 정보가 없습니다!");
        }
    });
});

function goToMenu() {
    window.location.href = "./level.html";
}