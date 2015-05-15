---
layout: post
title: Usando OpenCV no Galileo
comments: true
permalink: "usando-opencv"
author: Gabriela Cavalcante
tags: [galileo]
---

Algo que eu passei os ultimos dias tentando fazer, foi conectar uma câmera no Galileo e capturar imagens por ela. Caso você também queira fazer isso, vamos aqui começar o passo a passo. Conecte a câmera USB na saida USB do Galileo, você pode verificar se foi conectado vendo se o dispositivo aparece em ```/dev```. 

Caso você não tenho o OpenCV instalado (opkg list-installed | grep python-opencv), adicione os repositórios disponíveis no arquiv *.conf [¹](https://communities.intel.com/thread/56046).


```bash
$ cat > /etc/opkg/iot-devkit.conf <<EOF
> src iot-devkit-i586 http://iotdk.intel.com/repos/1.1/iotdk/i586 
> EOF

$ opkg update
 
$ opkg upgrade

$ opkg install python-opencv
```

Você pode usar o este código[²](http://codeplasma.com/2012/12/03/getting-webcam-images-with-python-and-opencv-2-for-real-this-time/) python para tirar uma foto com a câmera conectada usando o OpenCV.

```python
import cv2
 
# Camera 0 is the integrated web cam on my netbook
camera_port = 0
 
# Number of frames to throw away while the camera adjusts to light levels
ramp_frames = 30
 
# Now we can initialize the camera capture object with the cv2.VideoCapture class.
# All it needs is the index to a camera port.
camera = cv2.VideoCapture(camera_port)
 
# Captures a single image from the camera and returns it in PIL format
def get_image():
 # read is the easiest way to get a full image out of a VideoCapture object.
 retval, im = camera.read()
 return im
 
# Ramp the camera - these frames will be discarded and are only used to allow v4l2
# to adjust light levels, if necessary
for i in xrange(ramp_frames):
 temp = get_image()
print("Tirando a foto...")
# Take the actual image we want to keep
camera_capture = get_image()
file = "/home/root/opencv_image.png"
# A nice feature of the imwrite method is that it will automatically choose the
# correct format based on the file extension you provide. Convenient!
cv2.imwrite(file, camera_capture)
 
# You'll want to release the camera, otherwise you won't be able to create a new
# capture object until your script exits
del(camera)
```
Você deve querer ver a imagem, correto? Você pode mandá-la para seu computador por ssh.

```bash
$ scp <caminho da imagem>/opencv_image.png <seu user>@<ip da sua maquina>:/<pasta de destino>/

```