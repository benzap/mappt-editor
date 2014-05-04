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
#include <tuple>
#include <string>

#include "Mappt_Utils.hpp"
#include "Mappt_Globals.hpp"

#include "Map.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS
typedef std::vector<linkPair> entranceContainerType;

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
	const entranceContainerType getEntrancesWithGuid(guidType guid);
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
	const std::vector<guidType> getFullRoute(guidType firstPoint, guidType secondPoint);
	
	//Map Searching Functions
	const std::vector<std::string> getAllTags();
	const std::vector<std::string> getAllValuesForTag(std::string tagName);
	bool hasTag(std::string tagName);
    };
}
#endif //END MAPPTMANAGER__HPP
