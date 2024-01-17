import os
import cv2
from deepface import DeepFace
import matplotlib.pyplot as plt
backends = [
  'opencv', 
  'ssd', 
  'dlib', 
  'mtcnn', 
  'retinaface', 
  'mediapipe',
  'yolov8',
  'yunet',
  'fastmtcnn',
]

df_metrics = ["cosine", "euclidean", "euclidean_l2"]

models = [
  "VGG-Face", 
  "Facenet", 
  "Facenet512", 
  "OpenFace", 
  "DeepFace", 
  "DeepID", 
  "ArcFace", 
  "Dlib", 
  "SFace",
]

def check_duplicate(id):
    pass
    # if id+'.jpg' in os.listdir('C:\johnsegs\FLASK\deploy-face-model\\facemodel\ImageProcessor\img_db/'):
    #     return True
    # else:
    #     return False
    

def visulaize_frame(frame):
    # Convert BGR to RGB (OpenCV uses BGR by default)
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Display the image using Matplotlib
    plt.imshow(image_rgb)
    plt.axis('off')  # Turn off axis labels
    plt.show()


def get_id(list_list_df):
    if list_list_df==[]:
        return "empty"
    df = list_list_df[0]
    df = df.split("/")[-1]
    name = df.split(".")[0]
    return name
   



def delete_representations():
    for obj in os.listdir(os.getcwd()+'\img_db\\'):
        if obj.endswith('.pkl'):
            path = os.path.join(os.getcwd()+'\img_db\\', obj)
            os.remove(path)
            print('previous representations deleted')
    return

def delete_id(id):
    print("this path:",id)
    result={"message":"","success":False}
    try:
        
        for obj in os.listdir(os.getcwd()+'\img_db\\'):
            if obj.startswith(id):
                path = os.path.join(os.getcwd()+'\img_db\\', obj)
                os.remove(path)
                print(f'{path} deleted')
                result["message"]=f'{path} deleted'
                result['success']=True  
            else:
                e="not found"          
                result['message']=f"{id} not found in {os.getcwd()}'\img_db\\'"            
                result['success']=False            
    except Exception as e:
        print(e)
    return result


def detector(frame, enforce=True):
    try:
        return DeepFace.extract_faces(frame, detector_backend=backends[0], enforce_detection=enforce)
    except ValueError:
        return None
    

def detection(frame):
    try:
        dfs = DeepFace.find(img_path=frame, db_path="../images/img_db/", 
                            model_name="Facenet512", distance_metric="euclidean_l2")
        print('face found')
        return dfs
    except ValueError:
        print('face cannot be detected')
        return None
    


# a=delete_id("sta")
# print(a)