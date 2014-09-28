(ns mappt.database.core
  (:use mappt.database.database-protocols)
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

;;table creation
(when (not (user-tbl-exists? db))
  (user-tbl-create! db))
