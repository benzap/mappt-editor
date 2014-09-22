(ns mappt.database.sqlite.core
  (:use mappt.database.database-protocols)
  (:require [mappt.database.db :as db]
            [clojure.java.jdbc :as jdbc]))

(defrecord Sqlite [db-spec]
  Database_Utils
  (db-database-exists? [this]
    true)
  (db-create-database! [this])
  (db-remove-database! [this])
  Table_Utils
  (tbl-table-exists? [this name]
    (jdbc/with-db-connection [conn db-spec]
      (let [result
            (jdbc/query conn
                        ["SELECT name FROM sqlite_master
                          WHERE type='table'
                          AND name=?" name])]
        (not (empty? result)))))
  TableUser
  (user-tbl-exists? [this]
    (tbl-table-exists? this "users"))
  (user-tbl-create! [this]
    (let [schema
          "CREATE TABLE users (
             uid INTEGER PRIMARY KEY AUTOINCREMENT,
             username VARCHAR(255) NOT NULL,
             email VARCHAR(255) NOT NULL,
             password_hash VARCHAR(255) NOT NULL,
             date_created INTEGER(4) DEFAULT (strftime('%s', CURRENT_TIMESTAMP))
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema])))))

(def db-spec {:classname   "org.sqlite.JDBC"
              :subprotocol "sqlite"
              :subname     "mappt.db"})

(let [sql (Sqlite. db-spec)]
  (tbl-table-exists? sql "users")
  (user-tbl-exists? sql)
  (user-tbl-create! sql))
