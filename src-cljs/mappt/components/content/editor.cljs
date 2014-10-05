(ns mappt.components.content.editor
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]
            [mappt.canvas.core :as canvas]))

(defn widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:renderer nil})
    om/IWillMount
    (will-mount[this])
    om/IDidMount
    (did-mount [this]
      (let [dom-widget (om/get-node owner "content-editor")
            _ (.log js/console dom-widget)]
        (canvas/init dom-widget)))
    om/IRenderState
    (render-state [this state]
      (html [:div {:id "content-editor"
                   :ref "content-editor"
                   :style #js {:position "absolute"
                               :top 0 :right 0
                               :bottom 0 :left 0}}]))))
