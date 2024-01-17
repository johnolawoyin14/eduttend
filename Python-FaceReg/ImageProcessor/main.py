from flask import Blueprint, request, jsonify
import cv2
import numpy as np
import base64
import os
from image import register_face,face_detect
from helpers import delete_id

main = Blueprint("main", __name__)

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("data:",data)
    id = data.get('id', '')
    image_data = data.get('image_data', '')  # Change 'image_path' to 'image_data'

    if not id or not image_data:
        return jsonify({'error': 'Invalid request. Please provide "id" and "image_data" in the request body.'}), 400

    try:
        # Process the image using the register_face function
        result = register_face(id, image_data)

        # Return the result as JSON
        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500


@main.route("/detect",methods=['POST'])
def detect():
    data=request.get_json()
    print("data:",data)
    path=data.get("image_path")
    print(path)
    
    try:
        result=face_detect(image_path=path, db_path=os.getcwd()+'\img_db\\')
        print(result)

        return jsonify(result)
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal Server Error'}), 500

@main.route("/delete",methods=["POST"])
def delete():
    data=request.get_json()
    print("deleteData:",data)
    path=data.get("path")
    result=delete_id(path)
    return jsonify(result)