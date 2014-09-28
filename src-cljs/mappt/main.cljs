(ns mappt.main
  (:require [om.core :as om :include-macros true]
            [mappt.components.header-breadcrumb :as breadcrumb]
            [mappt.components.sidebar :as sidebar]
            [mappt.components.content :as content]
            [mappt.components.header-sign-in :as sign-in]
            [mappt.components.modal :as modal]
            [mappt.storage :as storage]))

(def app-state
  (atom {:breadcrumbs
         [{:name "Home" :url "#/"}
          {:name "User" :url "#/users/1"}]
         :sidebar
         {:buttons
          [{:name "Home" :url "/#/" :icon ""}
           {:name "Get Directions" :url "/#/get_directions" :icon ""}
           {:name "Explore" :url "/#/explore" :icon ""}
           {:name "Search" :url "/#/search" :icon ""}
           {:name "Go To Editor" :url "/#/editor" :icon ""}]
          :selected "Home"}
         :user
         {:username nil
          :is-admin? false}
         :modal
         {:open? true
          :content :register}}))

(add-watch app-state :storage
           (fn [key ref old new]
             (storage/store-app-state! new)))

(when (storage/retrieve-app-state)
  (reset! app-state (storage/retrieve-app-state)))

(let [content-target (.getElementById js/document "header-breadcrumb")]
  (om/root breadcrumb/widget
           app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "sidebar")]
  (om/root sidebar/widget
           app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "content")]
  (om/root content/widget
           app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "header-right")]
  (om/root sign-in/widget
           app-state
           {:target content-target}))

(let [content-target (.getElementById js/document "modal")]
  (om/root modal/widget
           app-state
           {:target content-target}))
