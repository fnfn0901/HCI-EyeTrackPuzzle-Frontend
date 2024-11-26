document.addEventListener("DOMContentLoaded", () => {
    const finishButton = document.getElementById("finishButton");
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

    // Finish 버튼 동작
    finishButton.addEventListener("click", () => {
        window.location.href = `./index.html`;
    });

    // Next Game 버튼 동작
    nextGameButton.addEventListener("click", () => {
        if (level) {
            const nextImageIndex = selectRandomImage();
            window.location.href = `./GameView.html?level=${level}&imageIndex=${nextImageIndex}`;
        } else {
            console.error("레벨 정보가 없습니다!");
        }
    });

    // 이미지 선택 함수
    function selectRandomImage() {
        const viewedImages = JSON.parse(sessionStorage.getItem("viewedImages")) || [];
        const unviewedImages = imagePool.filter((_, index) => !viewedImages.includes(index));

        // 방문하지 않은 이미지가 없으면 기록 초기화
        if (unviewedImages.length === 0) {
            console.log("모든 이미지를 보았습니다. 기록을 초기화합니다.");
            sessionStorage.removeItem("viewedImages");
        }

        // 방문하지 않은 이미지에서 랜덤 선택
        const randomIndex = unviewedImages.length > 0
            ? imagePool.indexOf(unviewedImages[Math.floor(Math.random() * unviewedImages.length)])
            : Math.floor(Math.random() * imagePool.length);

        // 선택한 이미지를 기록에 추가
        const updatedViewedImages = [...viewedImages, randomIndex];
        sessionStorage.setItem("viewedImages", JSON.stringify(updatedViewedImages));

        return randomIndex;
    }
});

// S3에서 이미지 목록 가져오기
async function fetchImages() {
    try {
        const response = await fetch('https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/?list-type=2&prefix=images/puzzles/');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const keys = Array.from(xmlDoc.getElementsByTagName("Key")).map(node => node.textContent);
        const baseUrl = 'https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/';
        const fetchedImagePool = keys.map(key => baseUrl + key);

        // S3에서 가져온 이미지 목록 저장
        sessionStorage.setItem("imagePool", JSON.stringify(fetchedImagePool));

        return fetchedImagePool;
    } catch (error) {
        console.error("이미지 목록을 가져오는 중 오류 발생:", error);
        return [];
    }
}

// 이미지가 없을 경우 S3에서 가져오도록 초기화
(async () => {
    const imagePool = JSON.parse(sessionStorage.getItem("imagePool")) || [];
    if (imagePool.length === 0) {
        await fetchImages();
    }
})();

function goToMenu() {
    window.location.href = "./level.html";
}