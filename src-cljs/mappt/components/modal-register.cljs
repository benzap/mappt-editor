(ns mappt.components.modal-register
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]
            [mappt.ajax :refer [post-request]]))

(defn request-register
  [{:keys [username password email
           register-channel
           error-channel]
    :as state}]
  (post-request
   "/api/register"
   :timeout 5
   :success-chan register-channel
   :error-chan error-channel
   :data {:username username
          :password password
          :email email}))

(defn widget [app owner]
  (reify
    om/IInitState
    (init-state [this]
      {:username nil
       :password nil
       :password2 nil
       :email nil
       :change-channel (chan)
       :register-channel (chan)
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
      (let [register-channel (om/get-state owner :register-channel)]
        (go (loop []
              (let [register-data (<! register-channel)]
                (.log js/console "register:" (clj->js register-data)))
              (recur))))
      (let [error-channel (om/get-state owner :error-channel)]
        (go (loop []
              (let [error-data (<! error-channel)]
                (.log js/console "error:" (clj->js error-data)))
              (recur)))))
    om/IRenderState
    (render-state [this {:keys [change-channel] :as state}]
      (html
       [:div {:id "modal-register"}
        "Username: "
        [:input {:type "text"
                 :class "input-text"
                 :style #js {:margin "5px"}
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:username value})))
                 :placeholder "At least 5 characters"}]
        [:br]
        "Password: "
        [:input {:type "password"
                 :class "input-text"
                 :style #js {:margin "5px"}
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:password value})))
                 :placeholder "*****"}]
        [:br]
        "Re-type Password: "
        [:input {:type "password"
                 :class "input-text"
                 :style #js {:margin "5px"}
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:password2 value})))
                 :placeholder "*****"}]
        [:br]
        "Email: "
        [:input {:type "text"
                 :class "input-text"
                 :style #js {:margin "5px"}
                 :on-change
                 (fn [e]
                   (let [value (-> e .-target .-value)]
                     (put! change-channel {:email value})))
                 :placeholder "name@domain.com"}]
        [:br]
        [:button {:class "button"
                  :on-click
                  (fn [_]
                    (request-register state))}
         "Register"]]))))
