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
                   :date_created)
           (merge user {:uid id})))
    (database/user-update! db id {:username "benz"})
    (is (let [user (database/user-get-by-id db id)
              username (:username user)]
          (= username "benz")))
    (database/user-delete! db id)
    (is (not (database/user-has-user? db "benz"))))

  (database/db-remove-database! db))

(deftest db-vector-table
  (database/db-create-database! db)

  (is (not (database/vector-tbl-exists? db)))
  (database/vector-tbl-create! db)
  (is (database/vector-tbl-exists? db))

  (let [vec1 {:x 1.0 :y 1.0 :z 1.0}
        vuuid (database/vector-insert! db vec1)
        vec1 (assoc vec1 :uuid vuuid)
        vec2 (database/vector-get-by-uuid db vuuid)]
    (is vec1 vec2))

  (let [vec1 {:x 1.0 :y 1.0 :z 1.0}
        vuuid (database/vector-insert! db vec1)
        vec1 (database/vector-get-by-uuid db vuuid)
        vec2 (assoc vec1 :x 1.2)
        vec1 (database/vector-update! db vec2)]
    (is vec2 vec1))

  (is (= (count (database/vector-get-list db))))

  (let [vec1 {:x 2.0 :y 2.1 :z 1.0}
        vuuid (database/vector-insert! db vec1)]
    (database/vector-delete! db {:uuid vuuid})
    (is (nil? (database/vector-get-by-uuid db vuuid))))
  
  (database/db-remove-database! db))

(deftest db-vector-array
  (database/db-create-database! db)

  
  
  (database/db-remove-database! db))


(run-all-tests)
