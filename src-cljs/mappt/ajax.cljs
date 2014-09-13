(ns mappt.ajax
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [ajax.core :refer [GET POST]]
            [cljs.core.async :refer [put! chan <!]]))

(defn test-handler [response]
  (.log js/console "received response" (str response)))

(defn test []
  (POST "/api/hello" 
        {:format :edn
         :params {:data [1 2 3 4]}
         :handler test-handler}))

(defn post-request [url])
