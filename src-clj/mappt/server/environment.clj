(ns mappt.server.environment
  (:require [environ.core :refer [env]]
            [clojure.edn :as edn]))

(def default-config
  {:database
   {:type :sqlite ;; [:postgresql :memory]
    :location "mappt.db"
    :salt "QtNvmgAQal"}})

(defn get-config []
  (try
    (let [config-path (env :mappt-config-path)
          config-string (slurp config-path)]
      (edn/read-string config-string))
    (catch Exception e
      (println "Using default config")
      default-config)))

;;(get-config)

