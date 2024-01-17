from helpers import backends, detector, models, df_metrics, delete_representations, get_id
import cv2
from cv2 import VideoCapture
from deepface import DeepFace
import os



import cv2
import os

def register_face(id, image_path):
    result = {"success": False, "message": "", "id": id, "image_path": ""}
    # check for duplicate id
    if id + '.jpg' in os.listdir(os.getcwd()+'\img_db\\'):
        print("id already exists")
        result["message"]="id already exists"
        return result

    # Load the image
    frame = cv2.imread(image_path)

    # Perform face detection
    face = detector(frame)
    if face:
        # crop and save image
        x, y, w, h = face[0]['facial_area'].values()
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
        crop_img = frame[y:y + h, x:x + w]

        # Display the image with the detected face
        # cv2.imshow('Detect Face', frame)
        # cv2.waitKey(0)

        # Save face
        face_path =os.getcwd()+'\img_db\\' + id + ".jpg"
        cv2.imwrite(face_path, crop_img)
        print(f" id {id} registered successfully")
        print(f"image stored in {face_path}")

        delete_representations()
        result["success"]=True
        result["message"] = f"id {id} registered successfully"
        result["image_path"] = face_path
        return result
    else:
        result["message"] = "No face detected in the provided image."
        
        print("No face detected in the provided image.")
        cv2.destroyAllWindows()
        return result


def face_detect(image_path, db_path):
    result = {"success": False, "message": "", "id": id, "image_path": ""}
    try:
        img_arr = cv2.imread(image_path)
        face_objs = DeepFace.extract_faces(img_path = img_arr,
            target_size = (224, 224),
            detector_backend = backends[4],enforce_detection=False)
        print("gotten here")

        face = face_objs[0]['face']
        file_path=False
        dfs = DeepFace.find(img_path=face, db_path=db_path,
                            model_name="Facenet512", distance_metric="euclidean_l2",
                            # detector_backend = backends[0],
                            enforce_detection=False)
        print("dfs:",dfs)
        for df in dfs:
            img_paths = df["identity"].values
            # print(img_paths)
            file_path=img_paths
        print(file_path)
        delete_representations()
        user_id = get_id(file_path)
        print(user_id)
        result["id"]=user_id
        result["success"]=True
    except Exception as e:
        print(f"Error in DeepFace.find: {e}")
        result["success"]=False
        result["message"]=f"Error in DeepFace.find: {e}"





   
    return result


