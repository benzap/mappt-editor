(ns mappt.ajax
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [ajax.core :refer [GET POST]]
            [cljs.core.async :refer [put! chan <!]]))

(defn echo-handler [response]
  (.log js/console "received response" (str response)))

(defn echo [data]
  (POST "/api/echo" 
        {:format :edn
         :params {:data data}
         :handler echo-handler}))

(def err-chan (chan))

(defn post-request
  [url & {:keys [data success-chan error-chan timeout]
          :or {data nil
               success-chan (chan)
               error-chan err-chan
               timeout 30}}]
  (POST url
        {:format :edn
         :timeout timeout
         :params {:data data}
         :handler
         (fn [response]
           (put! success-chan response))
         :error-handler
         (fn [response]
           (put! error-chan response))})
  success-chan)

(defn echo-server [data]
  (let [response-chan
        (post-request "/api/echo" :data data)]
    (go (loop []
          (let [response (<! response-chan)]
            (.log js/console "echo: " (str response))
          (recur))))))
