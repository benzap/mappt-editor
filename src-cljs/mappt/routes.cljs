(ns app.routes
  (:require [secretary.core 
             :as secretary 
             :include-macros true 
             :refer [defroute]]))

(defroute "/" {:as params}
  (js/console.log "hello"))

(defroute "/users/:id" {id :id}
  (js/console.log (str "User: " id)))

(secretary/dispatch! "/users/10")
