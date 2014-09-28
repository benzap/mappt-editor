(ns mappt.storage
  "Contains functions for storing information in local or session
  storage"
  (:require [cljs.reader :as edn]))

(defn has-session-storage? []
  (not= (.-sessionStorage js/window) js/undefined))

(defn get-session-data
  [key]
  (when (has-session-storage?)
    (let [ss (.-sessionStorage js/window)
          raw-data (.getItem ss key)]
      (when raw-data (edn/read-string raw-data)))))

(defn set-session-data!
  [key data]
  (when (has-session-storage?)
    (let [ss (.-sessionStorage js/window)
          raw-data (pr-str data)]
      (aset ss key raw-data))))

(defn has-local-storage? []
  (not= (.-localStorage js/window) js/undefined))

(defn get-data
  [key]
  (when (has-local-storage?)
    (let [ss (.-localStorage js/window)
          raw-data (.getItem ss key)]
      (when raw-data (edn/read-string raw-data)))))

(defn set-data!
  [key data]
    (when (has-local-storage?)
    (let [ss (.-localStorage js/window)
          raw-data (pr-str data)]
      (aset ss key raw-data))))

(def default-app-key "mappt_app_state")

(defn clear-app-state! [& [name]]
  (set-session-data! (or name default-app-key) js/undefined))

(defn store-app-state! [app & [name]]
  (set-session-data! (or name default-app-key) app))

(defn retrieve-app-state [& [name]]
  (get-session-data (or name default-app-key)))

