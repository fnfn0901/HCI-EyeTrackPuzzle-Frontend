import cv2
import mediapipe as mp
import pyautogui
import threading

# Initialize Face Mesh
face_mesh = mp.solutions.face_mesh.FaceMesh(refine_landmarks=True)

# Get screen width and height
screen_w, screen_h = pyautogui.size()

# Flag to stop the eye control loop
stop_thread = False

# Fixed scaling factor (감도 값 고정)
scaling_factor = 3.0

def start_eye_controlled_mouse():
    global stop_thread
    cam = cv2.VideoCapture(0)
    while not stop_thread:
        ret, frame = cam.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        output = face_mesh.process(rgb_frame)
        landmark_points = output.multi_face_landmarks
        frame_h, frame_w, _ = frame.shape
        if landmark_points:
            landmarks = landmark_points[0].landmark
            for id, landmark in enumerate(landmarks[474:478]):
                x = int(landmark.x * frame_w)
                y = int(landmark.y * frame_h)
                cv2.circle(frame, (x, y), 3, (0, 255, 0), -1)
                if id == 1:
                    screen_x = screen_w * (landmark.x - 0.5) * scaling_factor + screen_w / 2
                    screen_y = screen_h * (landmark.y - 0.5) * scaling_factor + screen_h / 2
                    pyautogui.moveTo(screen_x, screen_y)
            left_eye_landmarks = [landmarks[145], landmarks[159]]
            for landmark in left_eye_landmarks:
                x = int(landmark.x * frame_w)
                y = int(landmark.y * frame_h)
                cv2.circle(frame, (x, y), 3, (0, 255, 255), -1)
            if (left_eye_landmarks[0].y - left_eye_landmarks[1].y) < 0.004:
                pyautogui.click()
                pyautogui.sleep(1)
        # cv2.imshocw('Eye Controlled Mouse', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            stop_thread = True
            break
    cam.release()
    cv2.destroyAllWindows()

# Start the eye control thread immediately
def start_thread():
    global stop_thread
    stop_thread = False
    thread = threading.Thread(target=start_eye_controlled_mouse)
    thread.start()

# Start the program immediately without a Tkinter window
start_thread()