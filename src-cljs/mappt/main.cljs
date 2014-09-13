(ns mappt.main
  (:require [om.core :as om :include-macros true]
            [mappt.components.header-breadcrumb :as breadcrumb]
            [mappt.components.sidebar :as sidebar]))

(def app-state (atom {:name "haha!"
                      :breadcrumbs
                      [{:name "Home" :url "#/"}
                       {:name "User" :url "#/users/1"}]}))

(let [content-target (.getElementById js/document "header-breadcrumb")]
  (om/root breadcrumb/widget app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "sidebar")]
  (om/root sidebar/widget app-state
           {:target content-target}))

