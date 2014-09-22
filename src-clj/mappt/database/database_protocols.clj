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
  (user-get-by-id [this id]))
