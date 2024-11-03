function goToMenu() {
    window.location.href = 'index.html';
}

// URL 파라미터에서 결과 가져오기
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    const level = params.get('level');
    const time = params.get('time');

    // 레벨과 타이머 표시 설정
    const resultLevel = document.getElementById('resultLevel');
    const resultTimer = document.getElementById('resultTimer');
    resultLevel.textContent = level || '레벨';
    resultTimer.textContent = time || '00:00';

    // 결과 메시지 설정
    const resultMessage = document.getElementById('resultMessage');
    if (result === 'success') {
        resultMessage.textContent = 'Game Complete!';
    } else if (result === 'failure') {
        resultMessage.textContent = 'Game Over';
        resultMessage.style.color = '#FF8181'; // 실패 시 색상 변경
    }

    // 버튼 클릭 이벤트 설정
    document.getElementById('retryButton').onclick = () => {
        window.location.href = 'gameview.html';
    };
    document.getElementById('nextGameButton').onclick = () => {
        window.location.href = 'gameview.html';
    };
    document.getElementById('chooseLevelButton').onclick = () => {
        window.location.href = 'index.html';
    };
    document.getElementById('mainMenuButton').onclick = () => {
        window.location.href = 'index.html';
    };
};