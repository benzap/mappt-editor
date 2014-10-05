(ns mappt.canvas.three.core
  (:use [mappt.canvas.canvas-protocols
         :only [Canvas_Camera
                Canvas_Render
                Canvas_Draw]]))

(defrecord ThreeCanvas [renderer scene camera]
  Canvas_Render
  (get-dom-node [this]
    (.-domElement renderer))
  (render [this]
    (.render renderer scene camera))
  (animate [this]
    (js/requestAnimationFrame (partial render this))
    (render this))
  Canvas_Camera
  (camera-translate! [this x y z]
    (doto (:camera this)
      (.translateX x)
      (.translateY y)
      (.translateZ z))))


(defn create-three-canvas [camera]
  (let [renderer (new THREE.WebGLRenderer)
        scene (new js/THREE.Scene)]
    (->ThreeCanvas renderer scene camera)))
