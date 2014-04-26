#ifndef PARSER__HPP
#define PARSER__HPP
//DESCRIPTION
/*
  Used to parse a file representing a map layout
  Currently parses .xml files
 */

//CLASSES
class Parser;

//INCLUDES
#include <string>
#include "MapptManager.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS

//FUNCTIONS

//BEGIN
class Parser {
private:
    
public:
    void parseXmlString(std::string xmlString);
};

#endif //END PARSER__HPP
