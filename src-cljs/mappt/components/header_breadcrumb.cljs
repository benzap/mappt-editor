(ns mappt.components.header-breadcrumb
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]))

(defn widget [data]
  (om/component
   (html [:div "Hello world!"
          [:ul (for [n (range 1 10)]
                 [:li n])]
          (html/submit-button "React!")])))

(let [target (.getElementById js/document "content")]
  (.log js/console target)
  (om/root widget {} {:target target}))

