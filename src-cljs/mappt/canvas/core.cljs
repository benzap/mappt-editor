(ns mappt.canvas.core)

(declare cube)

(defn init [dom]
  (let [scene (new js/THREE.Scene)
        aspect-ratio (/ (.-clientWidth dom) (.-clientHeight dom))
        camera (new js/THREE.PerspectiveCamera 75 aspect-ratio 0.1 1000)
        renderer (new js/THREE.WebGLRenderer)
        renderer-dom (.-domElement renderer)]
    (doto renderer
      (.setSize (.-clientWidth dom) (.-clientHeight dom)))
    (.add scene (cube))
    (set! (-> camera .-position .-z) 5)
    (.appendChild dom renderer-dom)
    (.render renderer scene camera)))

(defn cube []
  (let [geometry (new js/THREE.BoxGeometry 1 1 1)
        material (new js/THREE.MeshBasicMaterial
                      #js {:color 0x00ff00})]
    (new js/THREE.Mesh geometry material)))
