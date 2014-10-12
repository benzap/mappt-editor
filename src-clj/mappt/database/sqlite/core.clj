(ns mappt.database.sqlite.core
  (:import java.io.File)
  (:use mappt.database.database-protocols
        mappt.database.utils)
  (:require [clojure.java.jdbc :as jdbc]))

(defrecord Sqlite [db-spec]
  Database_Utils
  (db-database-exists? [this]
    true)
  
  (db-create-database! [this]
    (jdbc/with-db-connection [conn db-spec]
      (let [schema
            "CREATE TABLE IF NOT EXISTS mappt_metadata (
               key VARCHAR(255),
               value VARCHAR(255)
             )"]
      (jdbc/execute! conn [schema]))))
  
  (db-remove-database! [this]
    (let [filename (db-spec :subname)
          file (File. filename)]
      (.delete file)))
  
  Table_Utils
  (tbl-table-exists? [this name]
    (jdbc/with-db-connection [conn db-spec]
      (let [result
            (jdbc/query conn
                        ["SELECT name FROM sqlite_master
                          WHERE type='table'
                          AND name=?" name])]
        (not (empty? result)))))
  
  TableUser
  (user-tbl-exists? [this]
    (tbl-table-exists? this "users"))

  (user-tbl-create! [this]
    (let [schema
          "CREATE TABLE users (
             uid INTEGER PRIMARY KEY AUTOINCREMENT,
             username VARCHAR(255) NOT NULL,
             email VARCHAR(255) NOT NULL,
             password_hash VARCHAR(512) NOT NULL,
             date_created INTEGER(4) DEFAULT (strftime('%s', CURRENT_TIMESTAMP))
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))

  (user-get-by-id [this id]
    (jdbc/with-db-connection [conn db-spec]
      (let [result
            (jdbc/query conn ["SELECT * FROM users WHERE uid = ?" id])]
        (first result))))

  (user-get-by-username [this name]
    (let [result
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             ["SELECT * FROM users WHERE username = ?" name]))]
      (first result)))

  (user-has-user? [this name]
    (let [result
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             ["SELECT COUNT(*) AS c FROM users 
               WHERE username = ?" name]))
          count (:c (first result))]
      (pos? count)))

  (user-insert! [this {:keys [username password_hash email]}]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/insert! conn :users {:username username
                                   :password_hash password_hash
                                   :email email}))))
  (user-update! [this id {:as user-map}]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/update! conn :users user-map ["uid = ?" id])))
  
  (user-delete! [this id]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/delete! conn :users ["uid = ?" id])))

  VectorTable
  (vector-tbl-exists? [this]
    (tbl-table-exists? this "vectors"))
  
  (vector-tbl-create! [this]
    (let [schema
          "CREATE TABLE vectors (
             uuid VARCHAR(36) NOT NULL UNIQUE,
             x REAL NOT NULL,
             y REAL NOT NULL,
             z REAL NOT NULL
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))
  
  (vector-get-by-uuid [this uuid]
    (let [result
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             ["SELECT * FROM vectors WHERE uuid = ?" uuid]))]
      (first result)))
  
  (vector-get-list [this])
  (vector-insert! [this {:keys [x y z uuid] :or {uuid (uuid)}}]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/insert! conn :vectors {:uuid uuid
                                     :x x :y y :z z}))) uuid)
  
  (vector-update! [this {:keys [x y z uuid]}]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/update! conn :vectors
                      {:x x :y y :z z}
                      ["uuid = ?" uuid]))))
  (vector-delete! [this {:keys [uuid]}]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/delete! conn :vectors ["uuid = ?" uuid]))))

  VectorArrayTable
  (vecarray-tbl-exists? [this]
    (tbl-table-exists? this "vector_arrays"))
  
  (vecarray-tbl-create! [this]
    (let [schema
          "CREATE TABLE vector_arrays (
             uuid VARCHAR(36) NOT NULL UNIQUE,
             vector_uuid VARCHAR(36) NOT NULL,
             numindex INTEGER NOT NULL,
             FOREIGN KEY (vector_uuid) REFERENCES vectors(uuid)
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))
  
  (vecarray-get-by-uuid [this uuid]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/query
         conn
         ["SELECT *
           FROM vector_arrays,
           INNER JOIN vectors
             ON vector_arrays.vector_uuid = vectors.uuid
           WHERE vector_arrays.uuid = ?" uuid]))))
  
  (vecarray-append! [this uuid vec]
    (let [index-cursor
          (jdbc/with-db-connection [conn db-spec]
            (jdbc/query
             conn
             "SELECT max(numindex) AS i
              FROM vector_arrays
              WHERE uuid = ?" uuid))
          index (or (-> index-cursor (first) :i) 0)]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/query
         conn
         ["INSERT INTO vector_arrays 
          (uuid, vector_uuid, numindex)
          VALUES (?, ?, ?)" uuid (:uuid vec) (inc index)]))))
  
  (vecarray-insert! [this uuid vec index])
  (vecarray-update! [this uuid vecs])

  MapptObjectTable
  (object-tbl-exists? [this])
  (object-tbl-create! [this])
  (object-get-by-uuid [this uuid])
  (object-insert! [this obj])
  (object-update! [this obj])
  (object-delete! [this obj])
  (object-delete-by-uuid! [this uuid])
  
  MapptPropertyTable
  (property-tbl-exists? [this])
  (property-tbl-create! [this])
  (property-get-by-uuid [this uuid])
  (property-insert! [this uuid])
  (property-update! [this uuid])
  (property-delete! [this uuid])

  MapptHierarchy
  (hierarchy-tbl-exists? [this])
  (hierarchy-tbl-create! [this])
  (hierarchy-insert! [this parent-uuid child-uuid])
  (hierarchy-remove! [this parent-uuid child-uuid])
  (hierarchy-get-parent [this child-uuid])
  (hierarchy-get-children [this parent-uuid]))

(def db-spec {:classname   "org.sqlite.JDBC"
              :subprotocol "sqlite"
              :subname     "mappt.db"})

(def db (Sqlite. db-spec))

(when (not (vector-tbl-exists? db))
  (vector-tbl-create! db))

(let [uuid-v1 (vector-insert! db {:x 1.0 :y 1.0 :z 1.0})]
  (vector-get-by-uuid db uuid-v1))

(when (not (vecarray-tbl-exists? db))
  (vecarray-tbl-create! db))
