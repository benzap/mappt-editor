(ns mappt.components.modal
  (:require [clojure.string :as s]
            [om.core :as om :include-macros true]
            [sablono.core :as html :refer-macros [html]]
            [cljs.core.async :refer [put! chan <!]]
            [mappt.style.icon :refer [gen-icon]]
            [mappt.components.modal-sign-in :as sign-in]
            [mappt.components.modal-register :as register]))

(def content-chan (chan))

(defn show-modal []
  (let [target (.getElementById js/document "modal")]
    (set! (-> target .-style .-display) "block")))

(defn hide-modal []
  (let [target (.getElementById js/document "modal")]
    (set! (-> target .-style .-display) "none")))

(defn modal-header-widget [app owner]
  (reify
    om/IRender
    (render [this]
      (html
       [:div {:id "modal-header"}
        [:div {:id "modal-header-text"
               :style
               #js {:color "white"
                    :float "left"
                    :padding "5px"
                    :fontFamily "'Roboto Slab', serif"}}
         [:h2 {} (-> app :modal :content name s/capitalize)]]
        [:div {:id "modal-cancel-button"
               :class "button-icon"
               :on-click
               (fn [_]
                 (om/update! app [:modal :open?] false))
               :style #js {:position "absolute"
                           :right 0}}
         (gen-icon "cancel" 16 2)]]))))

(defn widget [app owner]
  (reify
    om/IWillReceiveProps
    (will-receive-props [this next-props])
    om/IRender
    (render [this]
      (if (-> app :modal :open?)
        (show-modal)
        (hide-modal))
      (html [:div {:id "modal-container"}
             (om/build modal-header-widget app)
             
             [:div {:id "modal-content"}
              (condp = (-> app :modal :content)
                :sign-in (om/build sign-in/widget app)
                :register (om/build register/widget app)
                "Unknown Content")]]))))
