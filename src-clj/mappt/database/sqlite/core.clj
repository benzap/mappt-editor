(ns mappt.database.sqlite.core
  (:import java.io.File)
  (:use mappt.database.database-protocols
        mappt.database.utils)
  (:require [clojure.java.jdbc :as jdbc]))

(defrecord Sqlite [db-spec]
  Database_Utils
  (db-database-exists? [this]
    (let [filename (db-spec :subname)
          file (File. filename)]
      (.exists file)))
  
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
        (let [query
              (jdbc/insert! conn :users {:username username
                                         :password_hash password_hash
                                         :email email})]
          (-> query first first second)))))
  
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
                      ["uuid = ?" uuid])))
    {:x x :y y :z z :uuid uuid})
  
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
             uuid VARCHAR(36) NOT NULL,
             vector_uuid VARCHAR(36) NOT NULL,
             numindex INTEGER NOT NULL,
             FOREIGN KEY (vector_uuid) REFERENCES vectors(uuid)
               ON DELETE RESTRICT
               ON UPDATE CASCADE
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))
  
  (vecarray-get-by-uuid [this uuid]
    (let []
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/query
         conn
         ["SELECT v.*
           FROM vector_arrays AS va
           INNER JOIN vectors AS v
             ON va.vector_uuid = v.uuid
           WHERE va.uuid = ?
           ORDER BY va.numindex" uuid]))))

  (vecarray-get-vec-by-index [this uuid index]
    (let [query
          "SELECT v.*
           FROM vector_arrays AS va
           INNER JOIN vectors AS v
             ON va.vector_uuid = v.uuid
           WHERE va.uuid = ?
           AND va.numindex = ?"]
      (jdbc/with-db-connection [conn db-spec]
        (let [query
              (jdbc/query conn [query uuid index])]
          (first query)))))
  
  (vecarray-append! [this uuid vuuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [index-query-s
            "SELECT MAX(va.numindex) AS i
             FROM vector_arrays AS va
             WHERE va.uuid = ?"
            index-query
            (jdbc/query conn [index-query-s uuid])
            index (or (get-scalar index-query) -1)
            insert-query-map
            {:uuid uuid :vector_uuid vuuid :numindex (inc index)}
            insert-query
            (jdbc/insert! conn "vector_arrays" insert-query-map)])))

  (vecarray-insert! [this uuid vuuid index]
    (jdbc/with-db-connection [conn db-spec]
      (let [update-index-query-s
            "UPDATE vector_arrays
             SET numindex = numindex + 1
             WHERE numindex >= ?
             AND uuid = ?"
            update-query
            (jdbc/execute! conn [update-index-query-s index uuid])
            insert-query-map
            {:uuid uuid :vector_uuid vuuid :numindex index}
            insert-query
            (jdbc/insert! conn :vector_arrays insert-query-map)])))
  
  (vecarray-remove! [this uuid index]
    (jdbc/with-db-connection [conn db-spec]
      (let [remove-query
            (jdbc/delete! conn :vector_arrays ["numindex = ?" index])
            update-index-query-s
            "UPDATE vector_arrays
             SET numindex = numindex - 1
             WHERE numindex > ?
             AND uuid = ?"
            update-query
            (jdbc/execute! conn [update-index-query-s index uuid])])))

  ScalarTable
  (scalar-tbl-exists? [this]
    (tbl-table-exists? this "scalars"))
  
  (scalar-tbl-create! [this]
    (jdbc/with-db-connection [conn db-spec]
      (let [schema
            "CREATE TABLE scalars (
               uuid VARCHAR(36) NOT NULL UNIQUE,
               type VARCHAR(255),
               value VARCHAR(255)
             )"]
        (jdbc/execute! conn [schema]))))
  
  (scalar-get-by-uuid [this uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [query
            "SELECT *
             FROM scalars
             WHERE uuid = ?"
            result
            (jdbc/query conn [query uuid])]
        (first result))))
  
  (scalar-insert! [this {:keys [uuid type value]
                         :or {uuid (uuid)}}]
    (jdbc/with-db-connection [conn db-spec]
      (let [scalar-map
            {:uuid uuid
             :type type
             :value value}]
        (jdbc/insert! conn :scalars scalar-map)))
    uuid)
  
  (scalar-update! [this {:keys [uuid type value]
                         :as scalar}]
    (jdbc/with-db-connection [conn db-spec]
      (let []
        (jdbc/update! conn :scalars scalar ["uuid = ?" uuid]))))
  
  (scalar-delete! [this {:keys [uuid]}]
    (jdbc/with-db-connection [conn db-spec]
      (let []
        (jdbc/delete! conn :scalars ["uuid = ?" uuid]))))
  
  MapptObjectTable
  (object-tbl-exists? [this]
    (tbl-table-exists? this "mappt_objects"))
  
  (object-tbl-create! [this]
    (let [schema
          "CREATE TABLE mappt_objects (
             uuid VARCHAR(36) NOT NULL UNIQUE,
             name VARCHAR(255),
             type VARCHAR(255) 
           )"]
      (jdbc/with-db-connection [conn db-spec]
        (jdbc/execute! conn [schema]))))
  
  (object-get-by-uuid [this uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [select-query
            "SELECT *
             FROM mappt_objects
             WHERE uuid = ?"
            query
            (jdbc/query conn [select-query uuid])]
        (first query))))
  
  (object-list-all-by-type [this type]
    (jdbc/with-db-connection [conn db-spec]
      (let [select-query
            "SELECT *
             FROM mappt_objects
             WHERE type = ?"]
        (jdbc/query conn [select-query type]))))
  
  (object-insert! [this {:keys [name uuid type]
                         :or {name "untitled"
                              uuid (uuid)
                              type "OBJECT"}}]
    (jdbc/with-db-connection [conn db-spec]
      (let [obj {:name name :uuid uuid :type type}
            result (jdbc/insert! conn :mappt_objects obj)]
        uuid)))
  
  (object-update! [this {:keys [name uuid type]
                         :as obj}]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/update! conn :mappt_objects {:name name :type type}
                    ["uuid = ?" uuid])))
  
  (object-delete! [this {:keys [uuid]}]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/delete! conn :mappt_objects ["uuid = ?" uuid])))
  
  (object-delete-by-uuid! [this uuid]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/delete! conn :mappt_objects ["uuid = ?" uuid])))
  
  MapptPropertyTable
  (property-tbl-exists? [this]
    (tbl-table-exists? this "mappt_properties"))
  
  (property-tbl-create! [this]
    (jdbc/with-db-connection [conn db-spec]
      (let [schema
            "CREATE TABLE mappt_properties (
               name VARCHAR(255) NOT NULL,
               type VARCHAR(255) NOT NULL,
               value_uuid VARCHAR(36) NOT NULL,
               object_uuid VARCHAR(36) NOT NULL,
               FOREIGN KEY (object_uuid) REFERENCES mappt_objects(uuid)
                 ON DELETE CASCADE
                 ON UPDATE CASCADE
             )"]
        (jdbc/execute! conn [schema]))))

  (property-get-list-by-uuid [this uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [query
            ["SELECT *
              FROM mappt_properties
              WHERE object_uuid = ?" uuid]]
        (jdbc/query conn query))))

  (property-get-by-name [this uuid name]
    (jdbc/with-db-connection [conn db-spec]
      (let [select-query
            ["SELECT * FROM mappt_properties
              WHERE object_uuid = ? AND name = ?"
             uuid name]
            result
            (jdbc/query conn select-query)]
        (first result))))
  
  (property-insert! [this {:keys [name type value_uuid object_uuid]
                           :or {name (str "property-" (uuid))}
                           :as props}]
    (jdbc/with-db-connection [conn db-spec]
      (let [prop-map
            {:name name 
             :type type 
             :value_uuid value_uuid 
             :object_uuid object_uuid}]
        (jdbc/insert! conn :mappt_properties prop-map)
        prop-map)))

  (property-update! [this {:keys [name type value_uuid object_uuid]}]
    (jdbc/with-db-connection [conn db-spec]
      (let []
        (jdbc/update!
         db-spec :mappt_properties
         {:type type :value_uuid value_uuid}
         ["name = ? AND object_uuid = ?"
          name object_uuid]))))
  
  (property-delete! [this {:keys [name object_uuid]}]
    (jdbc/with-db-connection [conn db-spec]
      (let []
        (jdbc/delete!
         db-spec :mappt_properties
         ["name = ? AND object_uuid = ?"
          name object_uuid]))))
  
  MapptHierarchy
  (hierarchy-tbl-exists? [this]
    (tbl-table-exists? this "mappt_hierarchies"))
  
  (hierarchy-tbl-create! [this]
    (jdbc/with-db-connection [conn db-spec]
      (let [schema
            "CREATE TABLE mappt_hierarchies (
               parent_uuid VARCHAR(36) NOT NULL,
               child_uuid VARCHAR(36) NOT NULL,
               FOREIGN KEY (parent_uuid)
                 REFERENCES mappt_objects(uuid)
                 ON DELETE CASCADE
                 ON UPDATE CASCADE
               FOREIGN KEY (child_uuid)
                 REFERENCES mappt_objects(uuid)
                 ON DELETE CASCADE
                 ON UPDATE CASCADE
             )"]
        (jdbc/execute! conn [schema]))))
  
  (hierarchy-insert! [this parent-uuid child-uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [hierarchy-map
            {:parent_uuid parent-uuid
             :child_uuid child-uuid}]
        (jdbc/insert! conn :mappt_hierarchies hierarchy-map))))
  
  (hierarchy-remove! [this parent-uuid child-uuid]
    (jdbc/with-db-connection [conn db-spec]
      (jdbc/delete! conn :mappt_hierarchies
                    ["parent_uuid = ? AND child_uuid = ?"
                     parent-uuid child-uuid])))
  
  (hierarchy-get-parents [this child-uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [query
            "SELECT *.obj FROM mappt_hierarchies AS hierarchy
             INNER JOIN mappt_objects AS obj
             ON obj.uuid = hierarchy.parent_uuid
             WHERE hierarchy.child_uuid = ?"
            result
            (jdbc/query conn [query child-uuid])]
        result)))
  
  (hierarchy-get-children [this parent-uuid]
    (jdbc/with-db-connection [conn db-spec]
      (let [query
            "SELECT *.obj FROM mappt_hierarchies AS hierarchy
             INNER JOIN mappt_objects AS obj
             ON obj.uuid = hierarchy.parent_uuid
             WHERE hierarchy.parent_uuid = ?"]
        (jdbc/query conn [query parent-uuid])))))
