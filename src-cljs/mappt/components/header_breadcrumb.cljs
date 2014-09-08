(ns mappt.components.header-breadcrumb
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:class "breadcrumb-tree"}
             [:span "Home"] " > " [:span "Items"]]))))

#_(defn widget [data owner]
  (om/component
   (html [:div {:class :breadcrumb} "Home"])))
