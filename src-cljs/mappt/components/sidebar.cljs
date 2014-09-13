(ns mappt.components.sidebar
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]))

(def navigate-channel (chan))

(defn click-handler [state url e]
  (.log js/console "clicked!" url)
  (put! navigate-channel url))

(defn gen-sidebar-element [state name url icon]
  [:div {:class "sidebar-element"
         :on-click (partial click-handler state url)}
   [:div {:class "sidebar-icon"}]
   [:div {:class "sidebar-name"} name]])

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:class "sidebar-navigation"}
             (gen-sidebar-element data "test" "/#/test" "")
             (gen-sidebar-element data "test2" "/#/test2" "")]))))
