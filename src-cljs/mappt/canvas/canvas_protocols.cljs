(ns mappt.canvas.canvas-protocols)

(defprotocol Canvas_Camera
  "A set of canvas functions for navigating and moving the camera"
  (camera-get-aspect-ratio [this])
  (camera-set-aspect-ratio! [this ratio])
  (camera-translate! [this x y] [this x y z])
  (camera-rotate! [this i j k])
  (camera-rotate-x! [this angle])
  (camera-rotate-y! [this angle])
  (camera-rotate-z! [this angle])
  (camera-get-scale [this])
  (camera-set-scale! [this x y] [this x y z])
  (camera-get-position [this])
  (camera-set-position! [this x y] [this x y z]))
