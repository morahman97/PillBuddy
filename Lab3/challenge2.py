
# Fromm http://rpihome.blogspot.com/2015/03/face-detection-with-raspberry-pi.html

import io
import picamera
import cv2
import numpy

import time
#Create a memory stream so photos doesn't need to be saved in a file

#Get the picture (low resolution, so it should be quite fast)
#Here you can also specify other parameters (e.g.:rotate the image)
with picamera.PiCamera() as camera:
    camera.resolution = (320, 240)
    stream = io.BytesIO()
    # previous frame

    for f in camera.capture_continuous(stream, format='jpeg'):
        stream.truncate()
        stream.seek(0)
        #Convert the picture into a numpy array
        buff = numpy.fromstring(f.getvalue(), dtype=numpy.uint8)

        #Now creates an OpenCV image
        image = cv2.imdecode(buff, 1)

        #Convert to grayscale
        gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)

        circles = cv2.HoughCircles(gray, cv2.cv.CV_HOUGH_GRADIENT, 1.2, 2)

        if circles != None:
            for c in circles[0]:
                print str(c)
                cv2.circle(image, (c[0], c[1]), c[2], (255,0,0))
            cv2.imwrite('result.jpg',image)
            print "Found "+str(len(circles[0]))+" pill(s)"
            break

        time.sleep(1)

