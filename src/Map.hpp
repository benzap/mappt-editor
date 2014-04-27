#ifndef MAP__HPP
#define MAP__HPP
//DESCRIPTION
/*
  This is the class representation of a map stored within the mappt
  ecosystem
*/

//CLASSES
namespace Mappt {
    class Map;
}

//INCLUDES
#include <map>
#include <tuple>
#include <vector>

#include "Mappt_Utils.hpp"
#include "Mappt_Globals.hpp"

#include "Point.hpp"
#include "Image.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS
typedef std::vector<Mappt::Point> pointContainerType;
typedef std::vector<std::pair<Mappt::guidType, Mappt::guidType>> linkContainerType;

//FUNCTIONS

//BEGIN
namespace Mappt {
    class Map {
    private:
	std::string name;
	std::string description;
	pointContainerType points;
	linkContainerType links;
	std::vector<float> dimensions;
	std::vector<Image> images;
    public:
	Map();
	virtual ~Map() {}
    };
}


#endif //END MAP__HPP
