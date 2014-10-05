(ns mappt.canvas.canvas-protocols)

(defprotocol Canvas_Camera
  "A set of canvas functions for navigating and moving the camera"
  (camera-translate! [this x y] [this x y z])
  (camera-rotate! [this i j k])
  (camera-rotate-x! [this angle])
  (camera-rotate-y! [this angle])
  (camera-rotate-z! [this angle])
  (camera-get-scale [this])
  (camera-set-scale! [this x y] [this x y z])
  (camera-get-position [this])
  (camera-set-position! [this x y] [this x y z]))

(defprotocol Canvas_Render
  (render [this]))

(defprotocol Canvas_Draw
  (draw-point [this pt opts])
  (draw-line [this pts opts])
  (draw-polygon [this pts opts]))
