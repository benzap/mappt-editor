(ns mappt.canvas.three.core
  (:use [mappt.canvas.canvas-protocols :only [Canvas_Camera]]))

(defrecord ThreeCanvas [scene camera])

