(ns mappt.components.header-sign-in
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))



(defn view-header-signed-in [app]
  (let [username (-> app :user :username)]
    [:div {:class "header-right-container"
           :style #js {:position "relative"
                       :height "40px"
                       :margin-top "3px"
                       :float "right"}}
     [:span {:style #js {:padding "5px"}}
      (str "Signed in as " username)]
     [:button {:class "button-icon"}
      (gen-icon "cog" 12 0 1)]]))

(defn view-header-signed-out [app]
  (let []
    [:div {:class "header-right-container"
           :style #js {:position "relative"
                       :height "40px"
                       :margin-top "3px"
                       :float "right"}}
     [:a {:style
          #js {:vertical-align "middle"
               :padding "5px"}
          :on-click
          (fn [e]
            (.preventDefault e)
            (om/update! app [:modal :open?] true)
            (om/update! app [:modal :content] :register))}
      "Register"]
     [:button {:class "button"
               :style #js {:position "relative"
                           :margin "5px"
                           :padding "5px"}
               :on-click
               (fn [_]
                 (om/update! app [:modal :open?] true)
                 (om/update! app [:modal :content] :sign-in))}
      "Sign-in"]
     [:button {:class "button-icon"
               :style #js {}}
      (gen-icon "cog" 12 0 1)]]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (if (-> data :user :username)
        (html (view-header-signed-in data))
        (html (view-header-signed-out data))))))

