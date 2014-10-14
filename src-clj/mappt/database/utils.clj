(ns mappt.database.utils
  (:import java.util.UUID))

(defn uuid []
  (str (UUID/randomUUID)))

(defn get-scalar
  "given that the return value is scalar, will return the first map
  value"
  [query-result]
  (-> query-result first first second))

;;(get-scalar '({:map_value 1}))
