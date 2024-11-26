document.addEventListener("DOMContentLoaded", async function () {
    const buttonContainer = document.querySelector(".button-container");

    // 이미지 목록 가져오기
    const imagePool = JSON.parse(sessionStorage.getItem("imagePool")) || [];
    if (imagePool.length === 0) {
        await fetchImages(); // 이미지 목록 로드
    }

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
        button.onclick = () => {
            const imageIndex = selectRandomImage();
            const newHref = `${level.href}&imageIndex=${imageIndex}`;
            window.location.href = newHref;
        };
        buttonContainer.appendChild(button);
    });

    // 이미지 선택 함수
    function selectRandomImage() {
        const viewedImages = JSON.parse(sessionStorage.getItem("viewedImages")) || [];
        const unviewedImages = imagePool.filter((_, index) => !viewedImages.includes(index));

        // 모든 이미지를 본 경우 기록 초기화
        if (unviewedImages.length === 0) {
            sessionStorage.removeItem("viewedImages");
        }

        const randomIndex = unviewedImages.length > 0
            ? imagePool.indexOf(unviewedImages[Math.floor(Math.random() * unviewedImages.length)])
            : Math.floor(Math.random() * imagePool.length);

        // 선택된 이미지 기록 업데이트
        viewedImages.push(randomIndex);
        sessionStorage.setItem("viewedImages", JSON.stringify(viewedImages));
        return randomIndex;
    }

    // 이미지 목록 로드 함수
    async function fetchImages() {
        try {
            const response = await fetch('https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/?list-type=2&prefix=images/puzzles/');
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "text/xml");

            const keys = Array.from(xmlDoc.getElementsByTagName("Key")).map(node => node.textContent);
            const baseUrl = 'https://focuspuzzles3bucket.s3.ap-northeast-2.amazonaws.com/';
            const imagePool = keys.map(key => baseUrl + key);

            sessionStorage.setItem("imagePool", JSON.stringify(imagePool));
        } catch (error) {
            console.error("이미지 목록을 가져오는 중 오류 발생:", error);
        }
    }
});