
# Fromm http://rpihome.blogspot.com/2015/03/face-detection-with-raspberry-pi.html

import io
import picamera
import cv2
import numpy

import time

# We have this function to keep object moving left or right, but found that
# the requirement is actually very simple after talking to Manjot. So we are not
# using this.
def check_direction(image1, image2):
    """
    1 for moving right, -1 for moving left, 0 for no change. 
    image1 is the prev frame and image2 is current frame
    """
    # x coords
    result = image1[0] - image2[0]
    if result > 0:
        return -1
    elif result < 0:
        return 1
    return result

#Create a memory stream so photos doesn't need to be saved in a file
#Get the picture (low resolution, so it should be quite fast)
#Here you can also specify other parameters (e.g.:rotate the image)
with picamera.PiCamera() as camera:
    camera.resolution = (320, 240)
    stream = io.BytesIO()
    # previous frame
    count = 0

    for f in camera.capture_continuous(stream, format='jpeg'):
        stream.truncate()
        stream.seek(0)
        #Convert the picture into a numpy array
        buff = numpy.fromstring(f.getvalue(), dtype=numpy.uint8)

        #Now creates an OpenCV image
        image = cv2.imdecode(buff, 1)

        #Load a cascade file for detecting faces
        face_cascade = cv2.CascadeClassifier('/usr/share/opencv/haarcascades/haarcascade_frontalface_alt.xml')

        #Convert to grayscale
        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

        #Look for faces in the image using the loaded cascade file
        faces = face_cascade.detectMultiScale(gray, 1.1, 5)

        if len(faces) != count:
            count = len(faces)
            print "Found "+str(len(faces))+" face(s)"

        time.sleep(0.5)

