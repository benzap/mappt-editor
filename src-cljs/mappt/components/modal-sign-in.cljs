(ns mappt.components.modal-sign-in
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]))

(defn widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:username nil
       :password nil
       :change-channel (chan)})
    om/IWillMount
    (will-mount [this]
      (let [change-channel (om/get-state owner :change-channel)]
        (go (loop []
              (let [state-change (<! change-channel)]
                (om/update-state!
                 owner
                 (fn [_]
                   (merge (om/get-state owner)
                          state-change))))
              (recur)))))
    om/IRenderState
    (render-state [this {:keys [username password change-channel]
                         :as state}]
      (html
       [:div {:id "modal-sign-in"}
        [:input {:class "input-text"
                 :type "text"
                 :style #js {:margin "5px"}
                 :placeholder "Username"
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:username value})))
                 :value username}]
        [:br]
        [:input {:class "input-text"
                 :type "password"
                 :style #js {:margin "5px"}
                 :placeholder "Password"
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:password value})))
                 :value password}]
        [:br]
        [:button {:class "button"
                  :style #js {:text-align "center"}
                  :on-click
                  (fn [_]
                    (.log js/console (clj->js state)))}
         "Sign In"]]))))
