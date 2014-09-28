(ns mappt.server.login
  (:use mappt.database.database-protocols
        mappt.server.utils)
  (:require [mappt.database.core :refer [db]]))


(defn register-user! [data session])

(defn login-user! [{:keys [username password] :as data}
                   {:keys [is-admin? username]
                    :or {is-admin? false
                         username ""
                         password ""}
                    :as session}]
  (if (user-has-user? db username)
    (let [user (user-get-by-username db username)]
      (generate-api-response
       user
       {:username (user :username)
        :is-admin? true}))
    (generate-api-response
     {:error :invalid-login}
     session)))
  
