(ns mappt.components.sidebar
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]))

(def navigate-channel (chan))

(defn click-handler [state url name e]
  (.log js/console "clicked!" url)
  (om/transact! state :sidebar-selected #(str name))
  (put! navigate-channel url))

(defn gen-sidebar-element [state & {:keys [name url icon selected]
                                    :or {name "unknown"
                                         url "/#/"
                                         icon ""
                                         selected false}}]
  [:div {:class (str "sidebar-element" (when selected " selected"))
         :on-click (partial click-handler state url name)}
   [:div {:class "sidebar-icon"}]
   [:div {:class "sidebar-name"} name]])

(defn widget [data owner]
  (reify
    om/IRender
    (render [this]
      (html [:div {:class "sidebar-navigation"}
             (map (fn [elem]
                    (gen-sidebar-element
                     data
                     :name (elem :name)
                     :url (elem :url)
                     :icon (elem :icon)
                     :selected
                     (= (elem :name) (data :sidebar-selected))))
                  (data :sidebar))]))))
