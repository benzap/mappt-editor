(ns mappt.server.views
  (:require [mappt.server.styles :as styles])
  (:use [hiccup core page]
        [garden core]))

(def header
  [:div {:class :header}
   [:div {:class :header-left}
    [:span {:class :mappt-logo} "Mappt"]]
   [:div {:id :header-breadcrumb
          :class :header-breadcrumb}]
   [:div {:id :header-right
          :class :header-right}]])

(defn index-page []
  (html5
   [:head
    [:title "Mappt"]
    [:link
     {:href "http://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Righteous|Inconsolata"
      :rel "stylesheet"
      :type "text/css"}]
    (include-css "/css/fontello-fix.css")
    (include-css "/css/main.css")
    (include-css "/css/mappt-icons.css")
    (include-css "/css/animation.css")]
   [:body
    [:div {:class :main-container}
     header
     [:div {:id :sidebar :class :sidebar}]
     [:div {:id :content :class :content}]
     [:div {:id :modal :class :modal}]
     [:div {:id :modal-shade :class :modal-shade}]]
    (include-js "/js/extern/three/three.js")
    (include-js "/js/main.js")]))

(defn viewer-page []
  (html5
   [:head
    [:title "Mappt Viewer"]
    [:style (css [:h1 {:color "red"}])]]
   [:body
    [:div {:id "viewer"}]
    (include-js "/js/main.js")
    (include-css "/css/main.css")]))
