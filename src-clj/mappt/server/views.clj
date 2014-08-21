(ns mappt.server.views
  (:use [hiccup core page]
        [garden core]))

(defn index-page []
  (html5
   [:head
    [:title "Hello World"]
    [:style (css [:h1 {:color "red"}])]]
   [:body
    [:h1 "Hello World!"]
    (include-js "/js/main.js")]))
