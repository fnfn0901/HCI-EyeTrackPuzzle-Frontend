<div align="center">
  <img src="https://github.com/user-attachments/assets/a291cf75-ee1a-48d9-948c-66db4fdb5831" alt="Logo" style="width: 40%;">
</div>

**Focus Puzzle**은 눈의 움직임과 깜빡임만으로 퍼즐을 조작할 수 있는 웹 기반 게임입니다.

안구 추적 기술을 통해 손을 사용하지 않고 퍼즐을 맞추는 새로운 사용자 경험을 제공합니다.

어린이와 장애를 가진 사용자도 접근할 수 있는 직관적 인터페이스와 접근성을 목표로 개발되었습니다.

## 최종 화면
<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/70dcc461-f9af-4cc0-906a-c0aa66c8cd1d" alt="Image 1" width="300"></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/1d5fc311-a310-4065-95e9-c7e47cc34dc2" alt="Image 2" width="300"></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/ad0d1cb1-3255-495b-bf6f-6aea15dbaad5" alt="Image 3" width="300"></td>
    </tr>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/462b394c-fa69-4be0-a857-e7354ca0a8df" alt="Image 4" width="300"></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/4e292ab6-f691-41a7-9175-62e137ceca64" alt="Image 5" width="300"></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/679acd4d-f143-4951-8435-b9b7c990acf6" alt="Image 6" width="300"></td>
    </tr>
  </table>
</div>

### 시연 영상 (4배속)

<div align="center">
  <table>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/3bcc69d4-9377-4dc7-9454-cadbaa1a6cfe" alt="Image 1" width="400"></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/4f9ff0a0-85b6-4c12-9e03-169e3e3de452" alt="Image 2" width="400"></td>
    </tr>
  </table>
</div>

## **주요 기능**

1. **시선 기반 퍼즐 조작**
    - 웹캠을 통해 시선을 추적하고 깜빡임으로 퍼즐을 선택 및 이동.
2. **난이도 레벨 선택**
    - 2x2, 3x3, 4x4 크기의 퍼즐을 선택하여 난이도 조절.
3. **사용자 피드백 제공**
    - 커서 크기 조정 및 감도 설정으로 시선 추적 정확도 개선.
4. **EC2 서버 연동 및 퍼즐 이미지 관리**
    - AWS S3에서 퍼즐 이미지를 로드하여 다양한 테마 제공.

### **프로젝트 구조**

```
HCI-EYETRACKPUZZLE-FRONTEND
│
├── .github/
│   └── workflows/
│       └── deploy-to-s3.yml
│
├── frontend/
│   ├── css/
│   │   ├── gameview.css
│   │   ├── help.css
│   │   ├── level.css
│   │   ├── result.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── alert.js
│   │   ├── gameview.js
│   │   ├── help.js
│   │   ├── level.js
│   │   ├── main.js
│   │   ├── puzzle.js
│   │   ├── result.js
│   │   └── stopwatch.js
│   │
│   ├── images/
│   ├── fonts/
│   ├── html/
│   │   ├── GameView.html
│   │   ├── Help.html
│   │   ├── index.html
│   │   ├── level.html
│   │   └── result.html
│   │
│   └── assets/
│
├── backend/
│   ├── app.py
│   ├── model_final.py
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## **역할**

- **UI/UX 설계:**
    - Figma를 활용해 직관적이고 간결한 퍼즐 인터페이스 디자인.
    - 커스터마이징 가능한 난이도와 시선 추적 설정 화면 구현.
- **프론트엔드 개발:**
    - JavaScript로 퍼즐 조작 기능 구현.
    - Flask 서버와의 API 연동 시도.
- **트러블슈팅:**
    - EC2 서버 연동 및 퍼즐 데이터 관리 실패 사례 분석 및 개선 방향 제시.

## **사용 기술**

- **Frontend:** HTML, CSS, JavaScript
- **UI 디자인:** Figma
- **Backend 연동:** Flask, AWS EC2, AWS S3

## **트러블슈팅**

### **문제 1: EC2 서버와의 Flask 연동 실패**

**상황:**

- 로컬 환경에서는 시선 추적 모델(`model_final.py`)과 프론트엔드가 성공적으로 연동되었으나, EC2 서버로 배포하는 과정에서 데이터 전송 및 모델 실행에 실패.

**분석:**

- Flask와 EC2 간의 네트워크 요청에서 CORS(Cross-Origin Resource Sharing) 설정이 누락.
- 모델 실행 시 EC2 인스턴스의 자원 제한 문제 발생.

**해결 방안:**

- Flask 서버에서 `CORS` 활성화 및 적절한 헤더 설정 추가.
- EC2 인스턴스 업그레이드 또는 Lambda와 S3 조합으로 리소스 효율화.
- EC2에서 실행되는 Flask 서버가 시선 추적 모델을 제대로 실행하지 못한 점을 아래 코드로 확인.

```python
@app.route('/start_model', methods=['GET'])
def start_model():
    global model_process
    try:
        model_process = subprocess.Popen(
            ['python', 'model_final.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        return jsonify({"status": "Model started"})
    except Exception as e:
        return jsonify({"status": "Error starting model", "error": str(e)}), 500

```

**교훈:**

- 로컬과 서버 환경 간의 설정 차이를 철저히 검증해야 하며, CORS와 리소스 제한을 고려한 설계가 중요함.

## **성과**

- 사용자 피드백을 반영해 커스터마이징 가능한 퍼즐 조작 UI 구현.
- AWS S3와의 연동을 통해 동적인 이미지 관리 기반 구축.
- Flask 서버를 활용해 로컬 환경에서 시선 추적 모델의 성공적인 통합 달성.

## **결론 및 교훈**

- 사용자가 직관적으로 사용할 수 있는 UI 설계의 중요성을 체감.
- 클라우드 서버 환경의 복잡성을 이해하고 개선 방안을 도출하는 경험.
- 실패한 사례도 학습의 기회로 삼아, 서버-클라이언트 통합 과정에서의 주요 이슈를 사전 예방할 수 있는 노하우 축적.
