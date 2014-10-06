(ns mappt.canvas.canvas-protocols)

(defprotocol Canvas_Camera
  "A set of canvas functions for navigating and moving the camera"
  (camera-look-at! [this vec] [this x y z])
  (camera-translate! [this x y z])
  (camera-rotate! [this i j k rad])
  (camera-get-scale [this])
  (camera-set-scale! [this x y] [this x y z])
  (camera-get-position [this])
  (camera-set-position! [this x y] [this x y z]))

(defprotocol Canvas_Render
  (set-size! [this width height])
  (get-dom-node [this])
  (render [this])
  (animate [this]))

(defprotocol Canvas_Draw
  (draw-point [this pt opts])
  (draw-line [this pts opts])
  (draw-path [this pts opts]))
