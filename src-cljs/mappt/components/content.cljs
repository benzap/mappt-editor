(ns mappt.components.content
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:span "test"]))))
