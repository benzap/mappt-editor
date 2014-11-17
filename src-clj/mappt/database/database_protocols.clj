(ns mappt.database.database-protocols)

;;Utility-Related functions

(defprotocol Database_Utils
  "Set of functions to work specifically on a database"
  (db-database-exists? [this] [this name]
    "Checks if a given database exists")
  (db-create-database! [this] [this name]
    "Create the database")
  (db-remove-database! [this] [this name]
    "Remove the database, and delete all data permanently"))

(defprotocol Table_Utils
  "Set of functions to work specifically on tables in a database"
  (tbl-table-exists? [this name]
    "Returns whether the given relational table exists"))

;;Schema-Related Functions

(defprotocol TableUser
  "Table defined for users within the system"
  (user-tbl-exists? [this]
    "Checks if the relational table 'users' exists")
  (user-tbl-create! [this]
    "Creates the 'users' table")
  (user-get-by-id [this id]
    "Returns the user with the given id, in the form of a map")
  (user-get-by-username [this name]
    "Returns the userdata with the given username, in the form of a map")
  (user-has-user? [this name]
    "Returns true if the user with the given username exists")
  (user-insert! [this user-map]
    "user-map key-values:
       :username name
       :password_hash hash
       :email email")
  (user-update! [this id user-map]
    "updates the given user by the given uid. This can be used to
    change the username, password, and email of the given user")
  (user-delete! [this id]
    "deletes the user from the database"))

(defprotocol VectorTable
  (vector-tbl-exists? [this]
    "Returns true if the 'vectors' table exists")
  (vector-tbl-create! [this]
    "Creates the 'vectors' table")
  (vector-get-by-uuid [this uuid]
    "Gets the vector by the given uuid, otherwise returns nil")
  (vector-get-list [this]
    "Returns a list of all vectors in the database. Not recommended.")
  (vector-insert! [this vec]
    "Inserts the given vector into the database :keys [x y z uuid]")
  (vector-update! [this vec]
    "Updates the given vector with the given :uuid map value")
  (vector-delete! [this vec]
    "Deletes the given vector with the given :uuid map value"))

(defprotocol VectorArrayTable
  (vecarray-tbl-exists? [this]
    "Returns true if the 'vector_arrays' table exists")
  (vecarray-tbl-create! [this]
    "Creates the 'vector_arrays' table")
  (vecarray-get-by-uuid [this uuid]
    "Gets a vector of vectors")
  (vecarray-get-vec-by-index [this uuid index]
    "Gets the vector at the given index for the given vector array
    uuid")
  (vecarray-append! [this uuid vuuid]
    "appends a vector, with the given uuid (vuuid) to the vector array
    defined by (uuid)")
  (vecarray-insert! [this uuid vuuid index]
    "inserts a vector, with the given uuid (vuuid) to the vector array
    defined by (uuid) at the index (index)")
  (vecarray-remove! [this uuid index]
    "removes the given a vector from the given index (index) from the
    given vector array"))

(defprotocol ScalarTable
  (scalar-tbl-exists? [this]
    "checks if the 'scalars' table exists")
  (scalar-tbl-create! [this]
    "creates the 'scalars' table")
  (scalar-get-by-uuid [this uuid]
    "gets the scalar with the given uuid")
  (scalar-insert! [this scalar]
    "inserts a new scalar value :keys [uuid type value]
     :or [uuid (uuid)]")
  (scalar-update! [this scalar]
    "updates the given scalar with the current :uuid")
  (scalar-delete! [this scalar]
    "deletes the scalar with the given uuid"))

(defprotocol MapptObjectTable
  (object-tbl-exists? [this]
    "checks if the 'mappt_objects' table exists")
  (object-tbl-create! [this]
    "creates the 'mappt_objects' table")
  (object-get-by-uuid [this uuid]
    "get the object with the given uuid")
  (object-list-all-by-type [this type]
    "list all objects that have the given type")
  (object-insert! [this obj]
    "insert a new object by the given object map :keys [uuid name type]")
  (object-update! [this obj]
    "update the given object with the given uuid")
  (object-delete! [this obj]
    "delete the given object")
  (object-delete-by-uuid! [this uuid]
    "delete the object by the given uuid"))

(defprotocol MapptPropertyTable
  (property-tbl-exists? [this]
    "Returns true if the 'mappt_properties' table exists")
  (property-tbl-create! [this]
    "Creates the 'mappt_properties' table")
  (property-get-list-by-uuid [this uuid]
    "Returns a list of property entries for the given object_uuid
     :keys [name type value_uuid object_uuid]")
  (property-get-by-name [this uuid name]
    "Get a property for an object by name")
  (property-insert! [this prop]
    "Insert a property linked to a given object")
  (property-update! [this prop]
    "Update a property linked to a given object")
  (property-delete! [this prop]
    "Delete a property linked to a given object"))

(defprotocol MapptHierarchy
  (hierarchy-tbl-exists? [this]
    "Checks if the 'mappt_hierarchies' table exists")
  (hierarchy-tbl-create! [this]
    "Creates the 'mappt_hierarchies' table")
  (hierarchy-insert! [this parent-uuid child-uuid]
    "Inserts a hierarchy relationship between two objects")
  (hierarchy-remove! [this parent-uuid child-uuid]
    "Removes a hierarchy relationship between two objects")
  (hierarchy-get-parents [this child-uuid]
    "Returns a list of parent objects for the given child uuid")
  (hierarchy-get-children [this parent-uuid]
    "Returns a list of children objects for the given parent uuid"))
