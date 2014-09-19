(ns mappt.main
  (:require [om.core :as om :include-macros true]
            [mappt.components.header-breadcrumb :as breadcrumb]
            [mappt.components.sidebar :as sidebar]
            [mappt.components.content :as content]))

(def app-state
  (atom {:name "haha!"
         :breadcrumbs
         [{:name "Home" :url "#/"}
          {:name "User" :url "#/users/1"}]
         :sidebar
         [{:name "Home" :url "/#/" :icon ""}
          {:name "Get Directions" :url "/#/get_directions" :icon ""}
          {:name "Explore" :url "/#/explore" :icon ""}
          {:name "Search" :url "/#/search" :icon ""}
          {:name "Go To Editor" :url "/#/editor" :icon ""}]
         :sidebar-selected "Home"}))

(let [content-target (.getElementById js/document "header-breadcrumb")]
  (om/root breadcrumb/widget app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "sidebar")]
  (om/root sidebar/widget app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "content")]
  (om/root content/widget app-state
           {:target content-target}))
