#ifndef MAPPTMANAGER__HPP
#define MAPPTMANAGER__HPP
//DESCRIPTION
/*
  Includes all of the node information, node linking information, and
  map references.
 */

//CLASSES
class MapptManager;

//INCLUDES

//DEFINITIONS

//MACROS

//TYPEDEFS

//FUNCTIONS

//BEGIN
class MapptManager {
private:
    
public:
    MapptManager();
    virtual ~MapptManager();
    
    loadXmlString(std::string);
    loadJsonString(std::string);

};

#endif //END MAPPTMANAGER__HPP
