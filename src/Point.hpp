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
#include <algorithm>
#include <cassert>

//DEFINITIONS

//MACROS

//TYPEDEFS
typedef std::map<std::string, std::string> tagContainer;

//FUNCTIONS

//BEGIN
namespace Mappt {
    class Point {
    private:
	Mappt::guidType pointid = generateGUID();
	std::vector<float> position = {0.0, 0.0, 0.0};
	tagContainer tags;
    public:
	Point();
	virtual ~Point() {};
	
	//getters / setters
	const Mappt::guidType& getId();
	void setId(Mappt::guidType value);

	const std::vector<float>& getPosition();
	void setPosition(std::vector<float> value);

	//const tagContainer& getTags();
	//void setTags(tagContainer value);

	void setTag(std::string key, std::string value);
	bool hasTag(std::string key);
	std::string getTag(std::string key);
	void deleteTag(std::string key);
    };
}

#endif //END POINT__HPP
