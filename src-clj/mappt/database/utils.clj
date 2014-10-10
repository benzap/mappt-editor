(ns mappt.database.utils
  (:import java.util.UUID))

(defn uuid []
  (str (UUID/randomUUID)))
