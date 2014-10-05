(ns mappt.canvas.core
  (:require [mappt.canvas.canvas-protocols :as c]
            [mappt.canvas.three.core
             :as three
             :refer [create-three-canvas]]
            [mappt.canvas.three.camera :as camera]))

(declare cube)

(defn init [dom]
  (let [aspect-ratio (/ (.-clientWidth dom) (.-clientHeight dom))
        camera (new js/THREE.PerspectiveCamera 75 aspect-ratio 0.1 1000)
        canvas (create-three-canvas camera)
        scene (:scene canvas)
        renderer (:renderer canvas)
        renderer-dom (c/get-dom-node canvas)]
    (doto renderer
      (.setSize (.-clientWidth dom) (.-clientHeight dom)))
    (.add scene (cube))
    (set! (-> camera .-position .-z) 5)
    (.appendChild dom renderer-dom)
    (.render renderer scene camera)))

(defn cube []
  (let [geometry (new js/THREE.BoxGeometry 1 1 1)
        material (new js/THREE.MeshBasicMaterial #js {:color 0xaaffaa})]
    (new js/THREE.Mesh geometry material)))
