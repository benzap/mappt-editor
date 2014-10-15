(ns mappt.database.database-protocols)

;;Utility-Related functions

(defprotocol Database_Utils
  "Set of functions to work specifically on a database"
  (db-database-exists? [this] [this name]
    "Checks if a given database exists")
  (db-create-database! [this] [this name])
  (db-remove-database! [this] [this name]))

(defprotocol Table_Utils
  "Set of functions to work specifically on tables in a database"
  (tbl-table-exists? [this name]))

;;Schema-Related Functions

(defprotocol TableUser
  "Table defined for users within the system"
  (user-tbl-exists? [this])
  (user-tbl-create! [this])
  (user-get-by-id [this id])
  (user-get-by-username [this name])
  (user-has-user? [this name])
  (user-insert! [this user-map]
    "user-map key-values:
       :username name
       :password_hash hash
       :email email")
  (user-update! [this id user-map])
  (user-delete! [this id]))

(defprotocol VectorTable
  (vector-tbl-exists? [this])
  (vector-tbl-create! [this])
  (vector-get-by-uuid [this uuid])
  (vector-get-list [this])
  (vector-insert! [this vec])
  (vector-update! [this vec])
  (vector-delete! [this vec]))

(defprotocol VectorArrayTable
  (vecarray-tbl-exists? [this])
  (vecarray-tbl-create! [this])
  (vecarray-get-by-uuid [this uuid])
  (vecarray-get-vec-by-index [this uuid index])
  (vecarray-append! [this uuid vuuid])
  (vecarray-insert! [this uuid vuuid index])
  (vecarray-remove! [this uuid index]))

(defprotocol MapptObjectTable
  (object-tbl-exists? [this])
  (object-tbl-create! [this])
  (object-get-by-uuid [this uuid])
  (object-list-all-by-type [this type])
  (object-insert! [this obj])
  (object-update! [this obj])
  (object-delete! [this obj])
  (object-delete-by-uuid! [this uuid]))

(defprotocol MapptPropertyTable
  (property-tbl-exists? [this])
  (property-tbl-create! [this])
  (property-get-by-uuid [this uuid])
  (property-insert! [this prop])
  (property-update! [this prop])
  (property-delete! [this prop]))

(defprotocol MapptHierarchy
  (hierarchy-tbl-exists? [this])
  (hierarchy-tbl-create! [this])
  (hierarchy-insert! [this parent-uuid child-uuid])
  (hierarchy-remove! [this parent-uuid child-uuid])
  (hierarchy-get-parent [this child-uuid])
  (hierarchy-get-children [this parent-uuid]))
