(ns mappt.routes
  (:require [secretary.core 
             :as secretary 
             :include-macros true 
             :refer [defroute]]
            [goog.events :as events]
            [goog.history.EventType :as EventType])
  (:import goog.History))

(secretary/set-config! :prefix "#")

(defroute "/" {:as params}
  (.log js/console "hello!"))

(defroute "/home" {:as params}
  (.log js/console "home"))

(defroute "/users/:id" {id :id}
  (js/console.log (str "User: " id)))

(defroute "*" []
  (.log js/console "Unknown Url"))

;(let [location (.-location js/document)
;      pathname (.-pathname location)]
;  (secretary/dispatch! pathname))

(let [history (History.)]
  (events/listen history EventType/NAVIGATE
                 (fn [e]
                   (secretary/dispatch! (.-token e))))
  (doto history (.setEnabled true)))
