(ns mappt.server.login
  (:use mappt.database.database-protocols
        mappt.server.utils)
  (:require [mappt.database.core :refer [db]]
            [mappt.server.auth :as auth]))

(defn register-user! [{:keys [username password email] :as data}
                      {:keys [username] :as session}]
  (if (not (user-has-user? db username))
    (let [enc-password (auth/encrypt-password password)]
      (user-insert! db {:username username
                        :password enc-password
                        :email email})
      (generate-api-response
       {:username username
        :email email}
       {:username username}))
    (generate-api-response
     {:error :user-exists}
     session)))

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
  
