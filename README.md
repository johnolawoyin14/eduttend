After cloning this repo

the app is divided into node and python

/** lets deal with the node installations first**/


<!-- YOU MUST HAVE NODEJS V18 INSTALLED ON YOUR PC -->
    cd into \Node
        run "npm install"
            after the installation:
                run "npm start" ===>this shld show a message on ur terminal listening on port 2500
                if all the above works out then you are good to go


/**Now lets install python dependencies**/

<!-- YOU MUST HAVE EXACTLY PYTHON 3.8.0. NOTE THE WORD EXACTLY -->

    cd into \Python-FaceReg\ImageProcessor
        create a virtual environment
            inside the virtual environment pip install the following packages
                -flask
                -tensorflow
                -deepface
                -matplotlib
                -opencv

                    After successful installation
                        run "flask run" inside this \Python-FaceReg\ImageProcessor


Now that the installation is done, I will list out the endpoints and their params

MAKE SURE BOTH THE EXPRESS AND FLASK SERVERS ARE RUNNING

NOTE:- THE EXPRESS SERVER IS RUNNING ON http://localhost:2500/
NOTE2:-ALL THE ROUTES DEPEND ON THE OTHER DO NOT JUMP ANY, THE ROUTES ARE PROTECTED TO A LEVEL, IF U DONT LOGIN U WONT BE AUTHENTICATEDD 
***Routes***
1) /api/attendance/login
    -under this route pass in the lecturers name to login
    -this will then return a json which you can use for everyother aspect of this project
    -u can access the courses and the id from this json

2) /api/attendance/start/:id     ==>(replace :id with the id from the json returned from the login route)
    -pass in {course:"name of the course"}
    -this will return a success or failure message

3) /api/attendance/update
    -pass in captured image
    the model is undergoing development currently:
        1) This route will take up to minute or more before returning any message
        2) This model is not yet returning the right image_id just use this routes to test run your side of the project

 

