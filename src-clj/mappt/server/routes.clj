(ns mappt.server.routes
  (:use compojure.core
        mappt.server.views
        [hiccup.middleware :only (wrap-base-url)])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.response :as response]
            [prone.middleware :refer [wrap-exceptions]]))

(defroutes main-routes
  (GET "/" [] (index-page))
  (GET "/users/:id" [id] (index-page))
  (route/resources "/")
  (route/not-found "Page not found"))

(def app
  (-> (handler/site main-routes)
      wrap-exceptions
      (wrap-base-url)))
