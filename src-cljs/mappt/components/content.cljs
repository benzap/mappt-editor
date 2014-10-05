(ns mappt.components.content
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]
            [mappt.components.content.home :as home]
            [mappt.components.content.editor :as editor]))

(defn widget [app owner]
  (reify
    om/IRenderState
    (render-state [this state]
      (html 
       [:div {:id "content-container"
              :style
              #js {:position "absolute"
                   :width "100%"
                   :height "100%"}}
        (let [category (-> app :sidebar :selected)]
          (condp = category
            "Home" (om/build home/widget app)
            "Go To Editor" (om/build editor/widget app)
            (str "Unable to find component for category: " category)))]))))
