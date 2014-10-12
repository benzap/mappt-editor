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

(run-all-tests)
