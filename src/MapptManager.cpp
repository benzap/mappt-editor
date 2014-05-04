#include "MapptManager.hpp"

Mappt::MapptManager::MapptManager() {

}

//name
std::string Mappt::MapptManager::getName() {
    return this->name;
}

void Mappt::MapptManager::setName(std::string value) {
    this->name = value;
}


//entrances
void Mappt::MapptManager::addEntrance(Mappt::Point firstPoint,
				      Mappt::Point secondPoint) {
    auto firstId = guidType(firstPoint.getId());
    auto secondId = guidType(secondPoint.getId());
    auto link = linkPair(firstId, secondId);
    this->entrances.push_back(link);
}

void Mappt::MapptManager::addEntrance(guidType first, guidType second) {
    auto firstId = guidType(first);
    auto secondId = guidType(second);
    auto link = linkPair(firstId, secondId);
    this->entrances.push_back(link);
}

const entranceContainerType Mappt::MapptManager::getEntrancesWithGuid(guidType guid) {
    auto entranceLinks = entranceContainerType();
    for (auto entrance : this->entrances) {
	if (entrance.first == guid || entrance.second == guid) {
	    entranceLinks.push_back(entrance);
	}
    }
    return entranceLinks;
}

void Mappt::MapptManager::removeAllEntrancesWithGuid(guidType guid) {
    
}

const entranceContainerType& Mappt::MapptManager::getAllEntrances() {
    return this->entrances;
}


//maps
Mappt::Map& Mappt::MapptManager::newMap(std::string mapName) {
    auto map = Mappt::Map();
    map.setName(mapName);

    this->maps.push_back(map);
    return this->maps.back();
}

void Mappt::MapptManager::addMap(Map map) {
    this->maps.push_back(map);
}

void Mappt::MapptManager::removeMapByName(std::string mapName) {

}

Mappt::Map& Mappt::MapptManager::getMapByName(std::string mapName) {
    for (auto& map : this->maps) {
	if (map.getName() == mapName) {
	    return map;
	}
    }
    throw MapptException("Mappt::MapptManager::getMapByName",
			 "Unable to find map by name " + mapName);
}

bool Mappt::MapptManager::hasMapByName(std::string mapName) {
    return false;
}

const std::vector<Mappt::Map>& Mappt::MapptManager::getMaps() {
    return this->maps;
}

	
//helper functions
bool Mappt::MapptManager::hasPoint(guidType pointId) {
    for (auto& map : maps) {
	if (map.hasPoint(pointId)) {
	    return true;
	}
    }
    return false;
}

Mappt::Point& Mappt::MapptManager::getPoint(guidType pointId) {
    for (auto& map : maps) {
	if (map.hasPoint(pointId)) {
	    return map.getPointById(pointId);
	}
    }
    throw MapptException("Mappt::MapptManager::getPoint",
			 "Unable to get point with id " + pointId);
}

void Mappt::MapptManager::removePoint(guidType pointId) {
    for (auto& map : maps) {
	if (map.hasPoint(pointId)) {
	    return map.removePoint(pointId);
	}
    }
}


//Initialization / Loading / Clearing
void Mappt::MapptManager::loadXmlString(std::string) {

}

void Mappt::MapptManager::loadJsonString(std::string) {

}

void Mappt::MapptManager::clear() {
    this->maps.clear();
    this->entrances.clear();
}


//Map Routing Functions
const std::vector<Mappt::guidType> Mappt::MapptManager::getFullRoute(guidType firstPoint, guidType secondPoint) {
    return std::vector<guidType>();
}

	
//Map Searching Functions
const std::vector<std::string> Mappt::MapptManager::getAllTags() {
    return std::vector<std::string>();
}

const std::vector<std::string> Mappt::MapptManager::getAllValuesForTag(std::string tagName) {
    return std::vector<std::string>();
}

bool Mappt::MapptManager::hasTag(std::string tagName) {
    return false;
}

