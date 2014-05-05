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
    auto link = std::make_pair(firstPoint.getId(), secondPoint.getId());
    this->entrances.push_back(link);
}

void Mappt::MapptManager::addEntrance(guidType first, guidType second) {
    auto firstId = guidType(first);
    auto secondId = guidType(second);
    auto link = linkPair(firstId, secondId);
    this->entrances.push_back(link);
}

const std::vector<Mappt::guidType> Mappt::MapptManager::getEntrancesWithGuid(guidType guid) {
    auto entranceLinks = std::vector<Mappt::guidType>();
    for (auto entrance : this->entrances) {
	if (entrance.first == guid) {
	    entranceLinks.push_back(entrance.second);
	    continue;
	}
	else if (entrance.second == guid) {
	    entranceLinks.push_back(entrance.first);
	    continue;
	}
    }
    return entranceLinks;
}

const std::vector<Mappt::guidType> Mappt::MapptManager::getRelationsWithGuid(guidType guid) {
    auto relationLinks = std::vector<Mappt::guidType>();
    
    //concatentate the entrance links into the relationlinks vector
    auto entranceLinks = this->getEntrancesWithGuid(guid);
    relationLinks.insert(relationLinks.end(), entranceLinks.begin(), entranceLinks.end());
    
    //get the map's link relations
    auto point = this->getPoint(guid);
    auto mapName = point.getTag(MAPTAG);
    
    //get the point's map object
    auto map = this->getMapByName(mapName);
    auto pointLinks = map.getLinks(guid);
    
    //concatentate the maps links into the relation links vector
    relationLinks.insert(relationLinks.end(), pointLinks.begin(), pointLinks.end());

    return relationLinks;
}

bool Mappt::MapptManager::inSameMap(Mappt::guidType firstPoint, Mappt::guidType secondPoint) {
    auto p1 = this->getPoint(firstPoint);
    auto p2 = this->getPoint(secondPoint);
    
    if (p1.getTag(MAPTAG) == p2.getTag(MAPTAG)) {
	return true;
    }
    return false;
}

void Mappt::MapptManager::removeAllEntrancesWithGuid(guidType guid) {
    for (auto link = this->entrances.begin();
	 link != this->entrances.end(); link++) {
	if (link->first == guid || link->second == guid) {
	    this->entrances.erase(link);
	}
    }
}

const Mappt::entranceContainerType& Mappt::MapptManager::getAllEntrances() {
    return this->entrances;
}


//maps
Mappt::Map& Mappt::MapptManager::newMap(std::string mapName) {
    auto map = Mappt::Map();
    map.setName(mapName);
    this->maps.push_back(map);
    return maps.back();
}

void Mappt::MapptManager::addMap(Map map) {
    this->maps.push_back(map);
}

void Mappt::MapptManager::removeMapByName(std::string mapName) {
    for (auto map = this->maps.begin();
	 map != this->maps.end(); map++) {
	if (map->getName() == mapName) {
	    this->maps.erase(map);
	}
    }
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
    for (auto map : this->maps) {
	if (map.getName() == mapName) {
	    return true;
	}
    }
    return false;
}

const std::list<Mappt::Map>& Mappt::MapptManager::getMaps() {
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
	    map.removePoint(pointId);
	    return;
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

//Map Routing Functionality
const std::vector<Mappt::guidType> Mappt::MapptManager::getFullRoute(guidType firstPoint, 
								     guidType secondPoint,
								     costFunctionType costFunc) {
    
    return std::vector<guidType>();
}

	
//Map Searching Functions
const std::set<std::string> Mappt::MapptManager::getAllTags() {
    std::set<std::string> tagContainer;
    for (auto map : this->maps) {
	for (auto point : map.getPointContainer()) {
	    for (auto tagPair : point.getAllTags()) {
		std::string tagName = tagPair.first;
		tagContainer.insert(tagName);
	    }
	}
    }
    return tagContainer;
}

const std::set<std::string> Mappt::MapptManager::getAllValuesForTag(std::string tagName) {
    std::set<std::string> tagValuesContainer;
    for (auto map : this->maps) {
	for (auto point : map.getPointContainer()) {
	    if (point.hasTag(tagName)) {
		tagValuesContainer.insert(point.getTag(tagName));
	    }
	}
    }
    return tagValuesContainer;
}

bool Mappt::MapptManager::hasTag(std::string tagName) {
    auto tags = getAllTags();
    for (auto tag : tags) {
	if (tagName == tag) {
	    return true;
	}
    }
    return false;
}

