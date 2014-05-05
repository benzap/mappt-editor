#ifndef MAPPTMANAGER__HPP
#define MAPPTMANAGER__HPP
//DESCRIPTION
/*
  Includes all of the node information, node linking information, and
  map references.
*/

//CLASSES
namespace Mappt {
    class MapptManager;
}
//INCLUDES
#include <vector>
#include <list>
#include <set>
#include <tuple>
#include <string>
#include <functional>

#include "Mappt_Utils.hpp"
#include "Mappt_Globals.hpp"

#include "Map.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS
namespace Mappt {
    typedef std::vector<linkPair> entranceContainerType;
    typedef std::function<float(Point, Point)> costFunctionType;
}
//FUNCTIONS

//BEGIN
namespace Mappt {
    class MapptManager {
    private:
	std::string name;
	entranceContainerType entrances;
	std::list<Map> maps;
    public:
	//C&D
	MapptManager();
	virtual ~MapptManager() {};

	//name
	std::string getName();
	void setName(std::string value);

	//entrances
	void addEntrance(Point firstPoint, Point secondPoint);
	void addEntrance(guidType first, guidType second);
	const std::vector<guidType> getEntrancesWithGuid(guidType guid);

	//creates a list of points that relate to this point, whether
	//it be through an entrance relation, or a link relation.
	const std::vector<guidType> getRelationsWithGuid(guidType guid);

	//returns true if the two given points are contained within
	//the same map useful for determining if a given set of points
	//form a link relation, or an entrance relation
	bool inSameMap(guidType firstPoint, guidType secondPoint);

	//removes all of the entrance relations for the given point id
	void removeAllEntrancesWithGuid(guidType guid);
	const entranceContainerType& getAllEntrances();

	//maps
	Map& newMap(std::string mapName);
	void addMap(Map map);
	void removeMapByName(std::string mapName);
	Map& getMapByName(std::string mapName);
	bool hasMapByName(std::string mapName);
	const std::list<Map>& getMaps();
	
	//helper functions
	bool hasPoint(guidType pointId);
	Point& getPoint(guidType pointId);
	void removePoint(guidType pointId);

	//Initialization / Loading / Clearing
	void loadXmlString(std::string);
	void loadJsonString(std::string);
	void clear();

	//Map Routing Functions
	const std::vector<guidType> getFullRoute(guidType firstPoint,
						 guidType secondPoint,
						 costFunctionType func);
	
	//Map Searching Functions
	const std::set<std::string> getAllTags();
	const std::set<std::string> getAllValuesForTag(std::string tagName);
	bool hasTag(std::string tagName);
    };
}
#endif //END MAPPTMANAGER__HPP
