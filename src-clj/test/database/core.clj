(ns test.database.core
  (:use clojure.test
        mappt.database.utils)
  (:require [mappt.database.sqlite.core :refer [->Sqlite]]
            [mappt.database.database-protocols :as database]))


;;tests for sqlite
(def db-spec {:classname   "org.sqlite.JDBC"
              :subprotocol "sqlite"
              :subname     "mappt_test.db"})

(def db (->Sqlite db-spec))

(deftest db-create-with-exists
  (database/db-create-database! db)
  (is (database/db-database-exists? db))
  (database/db-remove-database! db)
  (is (not (database/db-database-exists? db))))

(deftest db-user-table
  (database/db-create-database! db)
  (is (not (database/user-tbl-exists? db)))
  (database/user-tbl-create! db)
  (is (database/user-tbl-exists? db))
  (let [user {:username "ben"
              :password_hash "test"
              :email "ben@test.com"}
        id (database/user-insert! db user)]
    (is (database/user-has-user? db "ben"))
    (is (= (dissoc (database/user-get-by-username db "ben")
                   :date_created)
           (merge user {:uid id})))
    (is (= (dissoc (database/user-get-by-id db id)
                   :date_craeted)
           (merge user {:uid id}))))

  
  
  (database/db-remove-database! db))




(run-all-tests)
