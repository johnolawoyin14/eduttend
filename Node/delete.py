import os
def delete_representations():

    for obj in os.listdir('C:\johnsegs\FLASK\deploy-face-model\\facemodel\ImageProcessor\img_db\\'):
        if obj.endswith('.pkl'):
            path = os.path.join('C:\johnsegs\FLASK\deploy-face-model\\facemodel\ImageProcessor\img_db\\', obj)
            os.remove(path)
            print('previous representations deleted')
    return