(ns mappt.server.routes
  (:use compojure.core
        ring.middleware.session
        ring.middleware.edn
        mappt.server.views
        mappt.server.utils
        [hiccup.middleware :only (wrap-base-url)])
  (:require [compojure.route :as route]
            [compojure.handler :as handler]
            [compojure.response :as response]
            [prone.middleware :refer [wrap-exceptions]]
            [mappt.server.login :as login]))

(defn generate-main-page [session]
  {:status 200
   :body (index-page)})

(defroutes main-routes
  (GET "/" {session :session}
       (generate-main-page session))

  (POST "/api/echo" {session :session 
                     {:keys [data]} :params} 
        (generate-api-response data session))

  (POST "/api/register" {session :session
                         {:keys [data]} :params}
        (login/register-user! data session))
  
  (POST "/api/login" {session :session 
                      {:keys [data]} :params}
        (login/login-user data session))

  (route/resources "/")
  (route/not-found "Page not found"))

(def app
  (-> (handler/site main-routes)
      wrap-exceptions
      wrap-edn-params
      (wrap-session)
      (wrap-base-url)))
