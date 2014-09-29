(ns mappt.content.home
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(defn widget [app owner]
  (reify
    om/IRenderState
    (render-state [this state]
      (html [:div {:id "content-home"}
             "Home"]))))
