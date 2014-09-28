(ns mappt.components.header-sign-in
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(defn view-header-signed-in [app]
  (let [username (-> app :user :username)]
    [:div {:class "header-right-container"}
     [:span (str "Signed in as " username)]
     [:button {:class "button-icon"}
      (gen-icon "cog" 20 5 2)]]))

(defn view-header-signed-out [app]
  (let []
    [:div {:class "header-right-container"} 
     [:button {:class "button"
               :on-click
               (fn [_]
                 (om/update! app [:modal :open?] true)
                 (om/update! app [:modal :content] :sign-in))}
      "Sign-in"]
     [:button {:class "button-icon"}
      (gen-icon "cog" 20 5 2)]]))

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (if (-> data :user :username)
        (html (view-header-signed-in data))
        (html (view-header-signed-out data))))))

