(ns mappt.main
  (:require [om.core :as om :include-macros true]
            [mappt.components.header-breadcrumb :as breadcrumb]))

(def app-state (atom {:name "haha!"
                      :breadcrumb
                      [{:name "Home" :url "/home"}]}))

(let [content-target (.getElementById js/document "header-breadcrumb")]
  (.log js/console content-target)
  (om/root breadcrumb/widget app-state {:target content-target}))
