(ns mappt.canvas.three.core
  (:use [mappt.canvas.canvas-protocols
         :only [Canvas_Camera
                Canvas_Render
                Canvas_Draw]]))



(defrecord ThreeCanvas [renderer scene camera]
  Canvas_Render
  (render [this]
    (.render renderer scene camera))
  Canvas_Camera
  (camera-translate! [this x y z]))

(defn create-three-canvas [camera]
  (let [renderer (new js/THREE.WebGLRenderer)
        scene (new js/THREE.Scene)]
    (->ThreeCanvas renderer scene camera)))
