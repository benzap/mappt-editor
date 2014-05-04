#ifndef MAPPTEXCEPTION__HPP
#define MAPPTEXCEPTION__HPP
//DESCRIPTION
/*
  Custom Exception for the Mappt library
 */

//CLASSES
namespace Mappt {
    class MapptException;
}
//INCLUDES
#include <iostream>
#include <exception>
#include <string>

//DEFINITIONS

//MACROS

//TYPEDEFS

//FUNCTIONS

//BEGIN
namespace Mappt {
    class MapptException : public std::exception {
    private:
	std::string funcName;
	std::string message;
    public:
	MapptException(std::string funcName, std::string message) :
	    funcName(funcName), message(message) {
	    
	}
	
	virtual const char* what() const throw() {
	    std::string returnString = "";
	    returnString += "\nX-Mappt Exception Thrown-X\n";
	    returnString += "Function :\t" + funcName + "\n";
	    returnString += "Message :\t" + message + "\n";
	    return returnString.c_str();
	}
    };
}
#endif //END MAPPTEXCEPTION__HPP
