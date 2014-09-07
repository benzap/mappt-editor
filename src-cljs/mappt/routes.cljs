(ns mappt.routes
  (:require [secretary.core 
             :as secretary 
             :include-macros true 
             :refer [defroute]]))

(defroute "/" {:as params}
  (js/console.log "hello!"))

(defroute "/user/:id" {id :id}
  (js/console.log (str "User: " id)))

(let [location (.-location js/document)
      pathname (.-pathname location)]
  (secretary/dispatch! pathname))


