(ns mappt.main
  (:require [om.core :as om :include-macros true]
            [mappt.components.header-breadcrumb :as breadcrumb]))

(def app-state (atom {:name "haha!"
                      :breadcrumbs
                      [{:name "Home" :url "#/"}
                       {:name "User" :url "#/users/1"}]}))

(let [content-target (.getElementById js/document "header-breadcrumb")]
  (om/root breadcrumb/widget app-state
           {:target content-target}))
