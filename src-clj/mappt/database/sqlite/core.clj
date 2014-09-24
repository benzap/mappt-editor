(ns mappt.database.sqlite.core
  (:use mappt.database.database-protocols)
  (:require [clojure.java.jdbc :as jdbc]))

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
             password_hash VARCHAR(512) NOT NULL,
             date_created INTEGER(4) DEFAULT (strftime('%s', CURRENT_TIMESTAMP))
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))

  (user-get-by-id [this id]
    (jdbc/with-db-connection [conn db-spec]
      (let [result
            (jdbc/query conn ["SELECT * FROM users WHERE uid = ?" id])]
        (first result))))

  (user-get-by-username [this name]
    (let [result
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             ["SELECT * FROM users WHERE username = ?" name]))]
      (first result)))

  (user-has-user? [this name]
    (let [result
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             ["SELECT COUNT(*) AS c FROM users 
               WHERE username = ?" name]))
          count (:c (first result))]
      (pos? count)))

  (user-insert! [this {:keys [username password_hash email]}]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/insert! conn :users {:username username
                                    :password_hash password_hash
                                    :email email}))))
  (user-update! [this id {:as user-map}]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/update! conn :users user-map ["uid = ?" id])))
  
  (user-delete! [this id]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/delete! conn :users ["uid = ?" id]))))

(def db-spec {:classname   "org.sqlite.JDBC"
              :subprotocol "sqlite"
              :subname     "mappt.db"})

(def sql (Sqlite. db-spec))

(let [sql (Sqlite. db-spec)]
  (when (not (user-tbl-exists? sql))
    (user-tbl-create! sql))
  (when (not (user-has-user? sql "benzap"))
    (user-insert! sql
                  {:username "benzap"
                   :email "benzaporzan@gmail.com"
                   :password_hash "test"}))
  (let [user (user-get-by-username sql "benzap")
        id (user :uid)]
    (user-update! sql id {:email "btzaporz@lakeheadu.ca"})))

;;(user-has-user? (Sqlite. db-spec) "benzap")
;;(user-get-by-username (Sqlite. db-spec) "benzap")
