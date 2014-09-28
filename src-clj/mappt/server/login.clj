(ns mappt.server.login
  "Has functions for logging in and registering."
  (:use mappt.database.database-protocols
        mappt.server.utils)
  (:require [mappt.database.core :refer [db]]
            [mappt.server.auth :as auth]))

(defn register-user!
  "Register user"
  [{:keys [username password email] :as data}
   {:keys [] :as session}]
  (if (not (user-has-user? db username))
    (let [enc-password (auth/encrypt-password password)]
      (user-insert! db {:username username
                        :password_hash enc-password
                        :email email})
      (generate-api-response
       {:username username
        :email email}
       (merge
        session
        {:username username})))
    (generate-api-response
     {:error :user-exists}
     session)))

(defn login-user
  [{:keys [username password] :as data}
   {:keys [is-admin?]
    :or {is-admin? false
         password ""}
    :as session}]
  (if (user-has-user? db username)
    (let [user (user-get-by-username db username)
          pw-hash (user :password_hash)
          authenticated? (auth/check-password password pw-hash)]
      (if authenticated?
        (generate-api-response
         user
         (merge
          session
          {:username username
           :is-admin? true}))
        (generate-api-response
         {:error :invalid-login-pw}
         session)))
    (generate-api-response
     {:error :invalid-login}
     session)))
  
