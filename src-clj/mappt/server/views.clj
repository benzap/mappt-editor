(ns mappt.server.views
  (:use [hiccup core page]
        [garden core]))

(defn index-page []
  (html5
   [:head
    [:title "Mappt"]
    [:style (css [:h1 {:color "red"}])]]
   [:body
    [:h1 "Hello World!"]
    (include-js "/js/main.js")]))

(defn viewer-page []
  (html5
   [:head
    [:title "Mappt Viewer"]
    [:style (css [:h1 {:color "red"}])]]
   [:body
    [:div {:id "viewer"}]
    (include-js "/js/main.js")]))
