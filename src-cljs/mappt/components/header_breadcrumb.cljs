(ns mappt.components.header-breadcrumb
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [secretary.core :as secretary]))

(defn click-handler [url e]
  (.log js/console "breadcrumb clicked! - " url))

(defn gen-breadcrumb [crumb]
  [:a {:href (crumb :url)
       :class "breadcrumb"
       :on-click (partial click-handler (crumb :url))}
   (crumb :name)])

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:class "breadcrumb-tree"}
             (let [crumbs-dom (map gen-breadcrumb (data :breadcrumbs))
                   crumbs (interpose
                           [:span {:class "breadcrumb-separator"} ">"]
                           crumbs-dom)]
               crumbs)]))))
