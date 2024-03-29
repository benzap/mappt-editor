(ns test.database.core
  (:use clojure.test
        mappt.database.utils)
  (:require [mappt.database.sqlite.core :refer [->Sqlite]]
            [mappt.database.database-protocols :as database]))

;;tests for sqlite
(def db-spec {:classname   "org.sqlite.JDBC"
              :subprotocol "sqlite"
              :subname     "mappt_test.db"})

(def db (->Sqlite db-spec))

(deftest db-create-with-exists
  (database/db-create-database! db)
  (is (database/db-database-exists? db))
  (database/db-remove-database! db)
  (is (not (database/db-database-exists? db))))

(deftest db-user-table
  (database/db-create-database! db)
  (is (not (database/user-tbl-exists? db)))
  (database/user-tbl-create! db)
  (is (database/user-tbl-exists? db))
  (let [user {:username "ben"
              :password_hash "test"
              :email "ben@test.com"}
        id (database/user-insert! db user)]
    (is (database/user-has-user? db "ben"))
    (is (= (dissoc (database/user-get-by-username db "ben")
                   :date_created)
           (merge user {:uid id})))
    (is (= (dissoc (database/user-get-by-id db id)
                   :date_created)
           (merge user {:uid id})))
    (database/user-update! db id {:username "benz"})
    (is (let [user (database/user-get-by-id db id)
              username (:username user)]
          (= username "benz")))
    (database/user-delete! db id)
    (is (not (database/user-has-user? db "benz"))))

  (database/db-remove-database! db))

(deftest db-vector-table
  (database/db-create-database! db)

  (is (not (database/vector-tbl-exists? db)))
  (database/vector-tbl-create! db)
  (is (database/vector-tbl-exists? db))

  (let [vec1 {:x 1.0 :y 1.0 :z 1.0}
        vuuid (database/vector-insert! db vec1)
        vec1 (assoc vec1 :uuid vuuid)
        vec2 (database/vector-get-by-uuid db vuuid)]
    (is vec1 vec2))

  (let [vec1 {:x 1.0 :y 1.0 :z 1.0}
        vuuid (database/vector-insert! db vec1)
        vec1 (database/vector-get-by-uuid db vuuid)
        vec2 (assoc vec1 :x 1.2)
        vec1 (database/vector-update! db vec2)]
    (is vec2 vec1))

  (is (= (count (database/vector-get-list db))))

  (let [vec1 {:x 2.0 :y 2.1 :z 1.0}
        vuuid (database/vector-insert! db vec1)]
    (database/vector-delete! db {:uuid vuuid})
    (is (nil? (database/vector-get-by-uuid db vuuid))))
  
  (database/db-remove-database! db))

(def vauuid (uuid))

(deftest db-vector-array
  (database/db-create-database! db)
  (database/vector-tbl-create! db)
  
  (is (not (database/vecarray-tbl-exists? db)))
  (database/vecarray-tbl-create! db)
  (is (database/vecarray-tbl-exists? db))

  (let [vec1 {:x 1.0 :y 2.0 :z 3.0}
        vuuid1 (database/vector-insert! db vec1)
        vec1 (assoc vec1 :uuid vuuid1)
        
        vec2 {:x 2.0 :y 3.0 :z 4.0}
        vuuid2 (database/vector-insert! db vec2)
        vec2 (assoc vec2 :uuid vuuid2)]
    
    (database/vecarray-append! db vauuid vuuid1)
    (database/vecarray-append! db vauuid vuuid2)
    
    ;;should be at least one at index 0
    (let [ind1 (database/vecarray-get-vec-by-index db vauuid 0)
          ind2 (database/vecarray-get-vec-by-index db vauuid 1)]
      (is (= vec1 ind1))
      (is (= vec2 ind2))))

  (let [vec3 {:x -1.0 :y 0.0 :z -1.2}
        vuuid3 (database/vector-insert! db vec3)
        vec3 (assoc vec3 :uuid vuuid3)]
    (database/vecarray-insert! db vauuid vuuid3 1)
    (let [ind2 (database/vecarray-get-vec-by-index db vauuid 1)]
      (is (= vec3 ind2)))

    (database/vecarray-remove! db vauuid 1)

    (let [ind2 (database/vecarray-get-vec-by-index db vauuid 1)]
      (is (not= vec3 ind2))))
  
  (database/db-remove-database! db))

(deftest db-objects
  (database/db-create-database! db)
  (is (not (database/object-tbl-exists? db)))
  (database/object-tbl-create! db)
  (is (database/object-tbl-exists? db))
  (let [obj1 {:name "map1" :type "TEST"}
        ouuid1 (database/object-insert! db obj1)
        obj1 (assoc obj1 :uuid ouuid1)]
    (is (= obj1 (database/object-get-by-uuid db ouuid1))))

  (is (= 1 (count (database/object-list-all-by-type db "TEST"))))

  (let [obj1 {:name "map2" :type "OBJECT"}
        ouuid1 (database/object-insert! db obj1)
        obj1 (assoc obj1 :uuid ouuid1 :name "map1")
        
        obj2 {:name "map3" :type "OBJECT"}
        ouuid2 (database/object-insert! db obj2)
        obj2 (assoc obj2 :uuid ouuid2)]
    (database/object-update! db obj1)
    (is (= obj1 (database/object-get-by-uuid db ouuid1)))
    (is (= 2 (count (database/object-list-all-by-type db "OBJECT"))))
    (database/object-delete-by-uuid! db ouuid1)
    (is (= 1 (count (database/object-list-all-by-type db "OBJECT"))))
    (database/object-delete! db obj2)
    (is (= 0 (count (database/object-list-all-by-type db "OBJECT")))))
  
  (database/db-remove-database! db))

(deftest db-scalar
  (database/db-create-database! db)

  (is (not (database/scalar-tbl-exists? db)))
  (database/scalar-tbl-create! db)
  (is (database/scalar-tbl-exists? db))

  (let [scalar-map1 {:type "STRING" :value "test"}
        scalar-uuid1 (database/scalar-insert! db scalar-map1)
        scalar1 (assoc scalar-map1 :uuid scalar-uuid1)
        
        scalar-map2 {:type "INT" :value "12"}
        scalar-uuid2 (database/scalar-insert! db scalar-map2)
        scalar2 (assoc scalar-map2 :uuid scalar-uuid2)]
    (is (= scalar1 (database/scalar-get-by-uuid db scalar-uuid1)))
    (is (= scalar2 (database/scalar-get-by-uuid db scalar-uuid2))))
  
  
  (database/db-remove-database! db))

(deftest db-property
  (database/db-create-database! db)
  
  (is (not (database/property-tbl-exists? db)))
  (database/property-tbl-create! db)
  (is (database/property-tbl-exists? db))

  ;;objects table which will hold properties
  (if-not (database/object-tbl-exists? db)
    (database/object-tbl-create! db))

  ;;for our property types
  (if-not (database/vector-tbl-exists? db)
    (database/vector-tbl-create! db))

  ;;scalar types
  (if-not (database/scalar-tbl-exists? db)
    (database/scalar-tbl-create! db))
  
  (let [obj1 {:name "map2" :type "OBJECT"}
        ouuid1 (database/object-insert! db obj1)
        obj1 (assoc obj1 :uuid ouuid1)

        scalar1 {:type "STRING" :value "benjamin"}
        scalar-uuid1 (database/scalar-insert! db scalar1)
        scalar1 (assoc scalar1 :uuid scalar-uuid1)
        
        prop1 {:name "first-name"
               :type "SCALAR"
               :value_uuid scalar-uuid1
               :object_uuid ouuid1}
        prop1 (database/property-insert! db prop1)

        _ (is (= 1 (count (database/property-get-list-by-uuid db ouuid1))))
        _ (is (= prop1 (database/property-get-by-name db ouuid1 "first-name")))

        vec1 {:x 1.0 :y 1.0 :z 1.0}
        vuuid (database/vector-insert! db vec1)
        vec1 (assoc vec1 :uuid vuuid)

        prop2 {:name "position"
               :type "VECTOR"
               :value_uuid vuuid
               :object_uuid ouuid1}
        prop2 (database/property-insert! db prop2)

        _ (is (= 2 (count (database/property-get-list-by-uuid db ouuid1))))
        _ (is (= prop2 (database/property-get-by-name db ouuid1 "position")))

        ;;delete first property
        _ (database/property-delete! db prop1)
        _ (is (= 1 (count (database/property-get-list-by-uuid db ouuid1))))
        ])
  
  (database/db-remove-database! db))

(deftest db-hierarchy
  (database/db-create-database! db)

  (is (not (database/hierarchy-tbl-exists? db)))
  (database/hierarchy-tbl-create! db)
  (is (database/hierarchy-tbl-exists? db))

  (if-not (database/object-tbl-exists? db)
    (database/object-tbl-create! db))

  (let [obj1 {:name "map" :type "OBJECT"}
        ouuid1 (database/object-insert! db obj1)
        obj1 (assoc obj1 :uuid ouuid1)

        obj2 {:name "child2" :type "OBJECT"}
        ouuid2 (database/object-insert! db obj2)
        obj2 (assoc obj2 :uuid ouuid2)

        obj3 {:name "child3" :type "OBJECT"}
        ouuid3 (database/object-insert! db obj3)
        obj3 (assoc obj3 :uuid ouuid3)
        
        ;;form a relationship between map and children
        _ (database/hierarchy-insert! db ouuid1 ouuid2)
        _ (database/hierarchy-insert! db ouuid1 ouuid3)

        t (is (= 1 (count (database/hierarchy-get-parents db ouuid2))))
        t (is (= obj1 (first (database/hierarchy-get-parents db ouuid2))))
        t (is (= obj1 (first (database/hierarchy-get-parents db ouuid3))))

        
        
        ])
  
  
  (database/db-remove-database! db))

(run-all-tests)
