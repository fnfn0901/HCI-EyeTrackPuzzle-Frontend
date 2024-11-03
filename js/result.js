function goToMenu() {
    window.location.href = 'index.html';
}

// URL 파라미터에서 결과 가져오기
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('result');
    const resultMessage = document.getElementById('resultMessage');
    if (result === 'success') {
    } else if (result === 'failure') {
    }
};