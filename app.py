from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS  # CORS 라이브러리 추가
import subprocess

app = Flask(
    __name__,
    static_folder='/Users/hoyeon/Desktop/HCI-EyeTrackPuzzle/Frontend',
    template_folder='/Users/hoyeon/Desktop/HCI-EyeTrackPuzzle/Frontend'
)

# CORS 활성화
CORS(app)

model_process = None  # 모델 프로세스를 관리하기 위한 변수


# 기본 라우트: index.html 반환
@app.route('/')
def serve_index():
    return send_from_directory(app.template_folder, 'index.html')


# 정적 파일 제공: CSS, JS, 이미지 파일 등
@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)


# 모델 시작 라우트
@app.route('/start_model', methods=['GET'])
def start_model():
    global model_process
    if model_process is None:
        try:
            # 모델 프로세스를 시작
            model_process = subprocess.Popen(
                ['python', '/Users/hoyeon/Desktop/HCI-EyeTrackPuzzle/Frontend/model_final.py'],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            return jsonify({"status": "Model started"})
        except Exception as e:
            return jsonify({"status": "Error starting model", "error": str(e)}), 500
    else:
        return jsonify({"status": "Model is already running"})


# 모델 상태 확인 라우트
@app.route('/model_status', methods=['GET'])
def model_status():
    global model_process
    if model_process and model_process.poll() is None:  # 모델 프로세스가 실행 중인 경우
        return jsonify({"status": "running"})
    else:
        return jsonify({"status": "stopped"})


# 모델 종료 라우트
@app.route('/stop_model', methods=['GET'])
def stop_model():
    global model_process
    if model_process is not None:
        model_process.terminate()  # 모델 프로세스 종료
        model_process = None
        return jsonify({"status": "Model stopped"})
    else:
        return jsonify({"status": "Model is not running"})


# favicon.ico 요청 처리
@app.route('/favicon.ico')
def favicon():
    return '', 204  # 빈 응답 반환


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)