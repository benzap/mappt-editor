(ns mappt.object.mapptobject
  (:use mappt.database.core)
  (:require [mappt.database.database-protocols :as database]))

(defprotocol Value
  "Protocol for manipulating a database via a clojure data type"
  (vinit [this]
    "Initialize the given data type. This should be called in favour
    of creating the given record.")
  (vget [this]
    "Get the value from the object in a clojure data type")
  (vset! [this value]
    "Set the value from the object in a clojure data type"))

(defprotocol Hierarchy
  "Protocol for getting and settings hierarchical elements of a type"
  (hparents [this]
    "get the hierarchical parents in the form of a list")
  (hset-child! [this uuid]
    "set a child object for this element")
  (hchildren [this]
    "get the children in the form of a list"))

(defrecord Vector [db uuid]
  Value
  (vinit [this])
  (vget [this])
  (vset! [this value]))

(defrecord VectorArray [db uuid]
  Value
  (vinit [this])
  (vget [this])
  (vset! [this value]))

(defrecord Scalar [db uuid]
  Value
  (vinit [this])
  (vget [this])
  (vset! [this value]))

(defrecord MapptObject [db uuid]
  Value
  (vinit [this])
  (vget [this])
  (vset! [this value]))


