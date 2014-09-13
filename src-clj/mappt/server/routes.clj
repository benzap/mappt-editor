(ns mappt.server.routes
  (:use compojure.core
        ring.middleware.edn
        mappt.server.views
        [hiccup.middleware :only (wrap-base-url)])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.response :as response]
            [prone.middleware :refer [wrap-exceptions]]))

(defn generate-api-response [data & [status]]
  {:status (or status 200)
   :headers {"Content-Type" "application/edn"}
   :body (pr-str data)})

(defroutes main-routes
  (GET "/" [] (index-page))
  (POST "/api/hello" [data] (generate-api-response {:hello data}))
  (route/resources "/")
  (route/not-found "Page not found"))

(def app
  (-> (handler/site main-routes)
      wrap-exceptions
      wrap-edn-params
      (wrap-base-url)))
