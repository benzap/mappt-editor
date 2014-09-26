(ns mappt.components.modal
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(def close-channel (chan))

(defn show-modal []
  )

(defn close-handler [e]
  (let [modal-dom (.getElementById "modal")]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:id "modal-container"}
             [:div {:id "modal-header"}
              [:div {:id "modal-cancel-button"
                     :class "button-icon"
                     :style #js {:position "absolute"
                                 :right 0}}
               (gen-icon "cancel" 16 2)]]
             [:div {:id "modal-content"}
              "this is content"]
             [:div {:id "modal-footer"}]]))))
