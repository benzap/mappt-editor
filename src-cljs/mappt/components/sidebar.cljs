(ns mappt.components.sidebar
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(defn sidebar-widget [{:keys [name url icon] :as data} owner]
  (reify
    om/IRenderState
    (render-state [this {:keys [selected select-chan] :as state}]
      (html [:div {:class
                   (str "sidebar-element"
                        (when (= name selected) " selected"))
                   :on-click
                   (fn [_]
                     (put! select-chan name)
                     (om/refresh! owner))}
             [:div {:class (str "sidebar-icon")}]
             [:div {:class "sidebar-name"} name]]))))

(defn widget [data owner]
  (reify
    om/IInitState
    (init-state [this]
      {:select-chan (chan)})
    om/IWillMount
    (will-mount [this]
      (let [select-chan (om/get-state owner :select-chan)]
        (go (loop []
              (let [selected (<! select-chan)]
                (om/update! data [:sidebar :selected] selected)
                (recur))))))
    om/IRenderState
    (render-state [this {:keys [select-chan] :as state}]
      (html [:div {:class "sidebar-navigation"}
             (om/build-all
              sidebar-widget
              (get-in data [:sidebar :buttons])
              {:init-state
               {:select-chan select-chan}
               :state
               {:selected (get-in data [:sidebar :selected])}})]))))
