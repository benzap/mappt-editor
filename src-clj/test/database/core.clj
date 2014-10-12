(ns test.database.core
  (:use clojure.test
        mappt.database.utils)
  (:require [mappt.database.sqlite.core :as sqlite]
            [mappt.database.database-protocols :as db]))
(deftest test
  (is (= 10 5)))

(run-all-tests)
