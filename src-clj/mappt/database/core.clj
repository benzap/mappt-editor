(ns mappt.database.core
 (:require [mappt.server.environment :refer [get-config]]
           [mappt.database.sqlite.core :refer [->Sqlite]]))

(def db
  (let [config (get-config)
        db-type (-> config :database :type)]
    (condp = db-type
      :sqlite
      (->Sqlite
       {:classname "org.sqlite.JDBC"
        :subprotocol "sqlite"
        :subname (or (-> config :database :location) "mappt.db")})
      nil)))

