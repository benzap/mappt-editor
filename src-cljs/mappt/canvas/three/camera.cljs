(ns mappt.canvas.three.camera)

(def default-fov 90)
(def default-near 1)
(def default-far 1)

(defn create-ortho [left right top bottom
                    & {:keys [near far]
                       :or {near default-near
                            far default-far}}]
  (new js/THREE.OrthographicCamera left right top bottom near far))

(defn update-ortho! [camera & {:keys [left right top bottom
                                      near far]}])

(defn create-persp [aspect & {:keys [fov near far]
                              :or {fov default-fov
                                   near default-near
                                   far default-far}}]
  (new js/THREE.PerspectiveCamera fov aspect near far))

(defn update-persp! [camera & {:keys [fov aspect near far]}])
