window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level'); // URL에서 level 값 가져오기

    if (level) {
        const rows = level === '1' ? 2 : level === '2' ? 3 : 4;
        const cols = rows;

        // 레벨 표시 업데이트
        const levelText = document.querySelector('.level-text');
        levelText.textContent = `Level ${level}`;

        // 퍼즐 게임 시작
        startGameWithRandomImage(rows, cols);
    } else {
        console.error("레벨 정보가 없습니다!");
    }
});