#ifndef POINT__HPP
#define POINT__HPP
//DESCRIPTION
/*
  Represents a point on the map
 */

//CLASSES
namespace Mappt {
    class Point;
}

//INCLUDES
#include "Mappt_Utils.hpp"
#include "Mappt_Globals.hpp"

#include <string>
#include <vector>
#include <map>

//DEFINITIONS

//MACROS

//TYPEDEFS
typedef std::map<std::string, std::string> tagContainer;

//FUNCTIONS

//BEGIN
namespace Mappt {
    class Point {
    private:
	guidType pointid;
	std::vector<float> position;
	tagContainer tags;
    public:
	Point();
	virtual ~Point() {};
    };
}

#endif //END POINT__HPP
