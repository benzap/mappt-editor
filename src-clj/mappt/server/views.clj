(ns mappt.server.views
  (:use [hiccup core page]))

(defn index-page []
  (html5
   [:head
    [:title "Hello World"]
    (include-css "/css/main.css")
    ]
   [:body
    [:h1 "Hello World!"]
    (include-js "/js/main.js")]))
