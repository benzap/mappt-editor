(ns mappt.server.views
  (:require [mappt.server.styles :as styles])
  (:use [hiccup core page]
        [garden core]))

(def header
  [:div {:class :header}
   [:div {:class :header-left}
    [:span {:class :mappt-logo} "Mappt"]]
   [:div {:class :header-breadcrumb} "Home >"]
   [:div {:class :header-right}
    [:button {:class :button} "Sign In"]
    [:button {:class :button-icon} "S"]]])

(defn index-page []
  (html5
   [:head
    [:title "Mappt"]]
   [:body
    [:div {:class :main-container}
     header
     [:div {:id :sidebar :class :sidebar}]
     [:div {:id :content :class :content}]]
    (include-js "/js/main.js")
    (include-css "/css/main.css")]))

(defn viewer-page []
  (html5
   [:head
    [:title "Mappt Viewer"]
    [:style (css [:h1 {:color "red"}])]]
   [:body
    [:div {:id "viewer"}]
    (include-js "/js/main.js")
    (include-css "/css/main.css")]))
