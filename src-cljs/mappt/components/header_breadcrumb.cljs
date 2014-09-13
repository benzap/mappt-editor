(ns mappt.components.header-breadcrumb
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]))

(defn append-breadcrumb!
  "appends a breadcrumb to the list of breadcrumbs"
  [state name url]
  (swap! state update-in [:breadcrumbs] conj {:name name :url url}))

(defn splice-breadcrumb!
  "splices the breadcrumb to the given url"
  [state url]
  (let [crumbs (:breadcrumbs @state)
        sp (split-with #(not= (:url %) url) crumbs)]
    (when (not (empty? (second sp)))
      (let [breadcrumbs (conj (first sp) (first (second sp)))]
        (om/transact! state :breadcrumbs #(vec breadcrumbs))))))

(def navigate-channel (chan))

(defn click-handler [state url e]
  (.log js/console "breadcrumb clicked! - " url)
  (put! navigate-channel url)
  (splice-breadcrumb! state url))

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
