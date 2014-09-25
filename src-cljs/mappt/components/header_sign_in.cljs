(ns mappt.components.header-sign-in
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(defn onclick-sign-in-handler [e]
  (.log js/console "clicked!"))

(defn modal-sign-in [state]
  [:div {:id "modal-container"}
   [:div {:id "modal-header"}]
   [:div {:id "modal-content"}]
   [:div {:id "modal-footer"}]])

(defn view-header-signed-in [state]
  (let [username (-> state :user :username)]
    [:div {:class "header-right-container"}
     [:span (str "Signed in as " username)]
     [:button {:class "button-icon"}
      #_[:i {:class "icon-cog"
           :style #js{:fontSize "20px"
                      :position "relative"
                      :bottom "2px"
                      :right "5px"}}]
      (gen-icon "cog" 20 5 2)
      ]]))

(defn view-header-signed-out [state]
  (let []
    [:div {:class "header-right-container"} 
             [:button {:class "button"
                       :on-click onclick-sign-in-handler} "Sign-in"]
             [:button {:class "button-icon"} "S"]]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html (view-header-signed-in data)))))

