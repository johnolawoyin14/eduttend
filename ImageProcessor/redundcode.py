import cv2

def register_new_face(name):
  
  face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
  
  cap = cv2.VideoCapture(0)
  while True:
    
    ret, frame = cap.read()
   
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    faces = face_cascade.detectMultiScale(gray_frame, 1.3, 5)
    
    for (x, y, w, h) in faces:
      cv2.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 3)
      face_img = gray_frame[y:y+h, x:x+w]
      face_img = cv2.resize(face_img, (224, 224))
      
    cv2.imshow('Register Face', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break
      
    elif cv2.waitKey(1) == ord('c'):
      
      # Save extracted face
      face_path = "../images/known_faces/"+name+".jpg"  
      cv2.imwrite(face_path, face_img)
      print(f"{name}'s face saved!")
      
      break
  
  cap.release()
  cv2.destroyAllWindows()
       

# Call this function to add new face   
# register_new_face("John")