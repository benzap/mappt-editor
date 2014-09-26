(ns mappt.components.sidebar
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [secretary.core :as secretary]
            [mappt.style.icon :refer [gen-icon]]))

(def navigate-channel (chan))

(defn click-handler [state url name e]
  (.log js/console "clicked!" url)
  (om/transact! state [:sidebar :selected] #(str name))
  (put! navigate-channel url))

(defn sidebar-widget [{:keys [name url icon] :as state} owner]
  (reify
    om/IRenderState
    (render-state [this {:keys [selected] :as state}]
      (html [:div {:class "sidebar-element"
                   :on-click
                   (fn [_]
                     (.log js/console "clicked!" name selected))}
             [:div {:class "sidebar-icon"}]
             [:div {:class "sidebar-name"} name]]))))

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
             (om/build-all
              sidebar-widget
              (get-in data [:sidebar :buttons])
              {:init-state
               {:selected (get-in data [:sidebar :selected])}})]))))
