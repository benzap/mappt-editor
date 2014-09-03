(ns app.routes
  (:require [secretary.core 
             :as secretary 
             :include-macros true 
             :refer [defroute]]))

(defroute "/" {:as params}
  (.log js/console params))

(defroute "/users/:id" {id :id}
  (.log js/console (str "User: " id)))

(secretary/dispatch! (-> js/window (.-location) (.-pathname)))
(.log js/console (-> js/window (.-location) (.-pathname)))
