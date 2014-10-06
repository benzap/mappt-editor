(ns mappt.canvas.core
  (:require [mappt.canvas.canvas-protocols :as c]
            [mappt.canvas.three.core
             :as three
             :refer [create-three-canvas]]
            [mappt.canvas.three.camera :as camera]))

(declare cube animate)

(defn init [dom]
  (let [aspect-ratio (/ (.-clientWidth dom) (.-clientHeight dom))
        camera (THREE.PerspectiveCamera. 75 aspect-ratio 0.1 1000)
        canvas (create-three-canvas camera)
        scene (:scene canvas)]
    (set! (.-rotationAutoUpdate camera) true)
    (c/set-size! canvas (.-clientWidth dom) (.-clientHeight dom))  
    (.add scene (cube))
    (c/camera-translate! canvas 0 0 3)
    (.appendChild dom (c/get-dom-node canvas))
    (animate canvas)))

(defn animate [canvas]
  (js/requestAnimationFrame (partial animate canvas))
  (c/camera-rotate! canvas 0 0.0 1 0.01)
  (c/render canvas))

(defn cube []
  (let [geometry (new js/THREE.BoxGeometry 1 1 1)
        material (new js/THREE.MeshBasicMaterial #js {:color 0xaaffaa})]
    (new js/THREE.Mesh geometry material)))
