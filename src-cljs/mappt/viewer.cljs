(ns mappt.viewer)

(defprotocol IViewer
  (view-map [map position scale]))
