(ns mappt.components.header-breadcrumb
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [secretary.core :as secretary]))

(defn append-breadcrumb!
  "appends a breadcrumb to the list of breadcrumbs"
  [state name url]
  (swap! state update-in [:breadcrumbs] conj {:name name :url url}))

(defn click-handler [state url e]
  (.log js/console "breadcrumb clicked! - " url))

(defn gen-breadcrumb [state crumb]
  [:a {:href (crumb :url)
       :class "breadcrumb"
       :on-click (partial click-handler state (crumb :url))}
   (crumb :name)])

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:class "breadcrumb-tree"}
             (let [gen-partial
                   (partial gen-breadcrumb data)
                   crumbs-dom
                   (map gen-partial (data :breadcrumbs))
                   crumbs
                   (interpose
                    [:span {:class "breadcrumb-separator"} ">"]
                    crumbs-dom)]
               crumbs)]))))
