(ns mappt.canvas.three.core
  (:use [mappt.canvas.canvas-protocols
         :only [Canvas_Camera
                Canvas_Render
                Canvas_Draw]]))

(defrecord ThreeCanvas [renderer scene camera]
  Canvas_Render
  (init [this])
  (set-size! [this width height]
    (.setSize renderer width height))
  (get-dom-node [this]
    (.-domElement renderer))
  (render [this]
    (.render renderer scene camera))
  Canvas_Camera
  (camera-look-at! [this x y z]
    (doto camera
      (.lookAt (THREE.Vector3 x y z))))
  (camera-translate! [this x y z]
    (doto camera
      (.translateX x)
      (.translateY y)
      (.translateZ z)))
  (camera-rotate! [this i j k rad]
    (let [axis (THREE.Vector3. i j k)]
      (.normalize axis)
      (.rotateOnAxis camera axis rad))))


(defn create-three-canvas [camera]
  (let [renderer (new THREE.WebGLRenderer)
        scene (new js/THREE.Scene)]
    (->ThreeCanvas renderer scene camera)))
