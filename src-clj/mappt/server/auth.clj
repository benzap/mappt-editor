(ns mappt.server.auth
  (:require [crypto.password.scrypt :as password]
            [mappt.server.environment :refer [get-config]]))

(defn salted
  "Salts the password using a salt-value supplied"
  [s]
  (let [salt (-> (get-config) :database :salt)]
    (str salt s "clojure")))

(defn encrypt-password [s]
  (let [pw-string (salted s)]
    (password/encrypt pw-string)))

(defn check-password [s encrypted]
  (password/check (salted s) encrypted))

;;(encrypt-password "test")
;;(check-password "test" (encrypt-password "test"))
