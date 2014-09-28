(ns mappt.components.modal-sign-in
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]
            [mappt.ajax :refer [post-request]]))


(defn request-login
  [{:keys [username password
           login-channel
           error-channel]
    :as state}]
  (post-request
   "/api/login"
   :timeout 5
   :success-chan login-channel
   :error-chan error-channel
   :data {:username username
          :password password}))

(defn process-login [app {:keys [username] :as login-data}]
  )

(defn widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:username nil
       :password nil
       :change-channel (chan)
       :login-channel (chan)
       :error-channel (chan)})
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
              (recur))))
      (let [login-channel (om/get-state owner :login-channel)]
        (go (loop []
              (let [login-data (<! login-channel)]
                (.log js/console "login:" (clj->js login-data))
                (process-login app login-data))
              (recur))))
      (let [error-channel (om/get-state owner :error-channel)]
        (go (loop []
              (let [error-data (<! error-channel)]
                (.log js/console "error:" (clj->js error-data)))
              (recur)))))
    om/IRenderState
    (render-state [this {:keys [username password
                                change-channel
                                login-channel
                                error-channel]
                         :as state}]
      (html
       [:div {:id "modal-sign-in"}
        "Username: "
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
        "Password: "
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
                    (request-login state))}
         "Sign In"]]))))
