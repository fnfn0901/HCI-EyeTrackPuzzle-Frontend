document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.querySelector(".button-container");

    const button = document.createElement("button");
    button.className = "game-button";
    button.textContent = "start";
    
    button.onclick = () => {
        // 모델 시작 요청
        fetch("http://localhost:5001/start_model", {
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "Model started" || data.status === "Model is already running") {
                checkModelStatus(); // 모델 상태 확인 시작
            } else {
                alert(data.status);
            }
        })
        .catch(error => {
            console.error('Error starting model:', error);
            alert('모델 시작 중 오류가 발생했습니다.');
        });
    };

    buttonContainer.appendChild(button);

    // 모델 상태를 주기적으로 확인하는 함수
    function checkModelStatus() {
        const intervalId = setInterval(() => {
            fetch("http://localhost:5001/model_status", {
                method: "GET",
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === "running") {
                    clearInterval(intervalId); // 상태 확인 중단
                    window.location.href = "level.html"; // 다음 화면으로 이동
                }
            })
            .catch(error => {
                console.error('Error checking model status:', error);
                alert('모델 상태 확인 중 오류가 발생했습니다.');
            });
        }, 1000); // 1초마다 상태 확인
    }
});