(ns mappt.components.content
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]
            [mappt.content.home :as home]))

(defn widget [app owner]
  (reify
    om/IRenderState
    (render-state [this state]
      (html 
       [:div {:id "content-container"}
        (let [category (-> app :sidebar :selected)]
          (condp = category
            "Home" (om/build home/widget app)
            (str "Unable to find component for category: " category)))]))))
