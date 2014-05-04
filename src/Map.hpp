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
#include "MapptException.hpp"

#include "Point.hpp"
#include "Image.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS
typedef std::vector<Mappt::Point> pointContainerType;
typedef std::pair<Mappt::guidType, Mappt::guidType> linkPair;
typedef std::vector<linkPair> linkContainerType;

//FUNCTIONS

//BEGIN
namespace Mappt {
    class Map {
    private:
	std::string name = "None";
	std::string description = "None";
	pointContainerType points;
	linkContainerType links;
	std::vector<float> dimensions;
	std::vector<Image> images;
    public:
	Map();
	virtual ~Map() {}
	
	//getters / setters
	const std::string& getName();
	void setName(std::string value);

	const std::string& getDescription();
	void setDescription(std::string value);

	const pointContainerType& getPointContainer();
	Point& newPoint();
	void addPoint(Point point);
	bool hasPoint(guidType pointid);
	void removePoint(int index);
	void removePoint(guidType pointid);
	Point& getPointById(guidType pointid);
	std::vector<Point*> getPointsByTag(std::string key);

	const linkContainerType& getLinkContainer();
	void addLink(guidType firstGuid, guidType secondGuid);
	void addLink(Point firstPoint, Point secondPoint);
	bool hasLink(guidType firstGuid, guidType secondGuid);
	void removeLink(int index);
	void removeLink(guidType firstGuid, guidType secondGuid);
	void removeAllLinks(guidType pointid);
	const std::vector<linkPair> getLinks(guidType pointid);
	
	const std::vector<float>& getDimensions();
	void setDimensions(std::vector<float> value);

	const std::vector<Image>& getImageContainer();
	void addImage(Image image);
    };
}


#endif //END MAP__HPP
