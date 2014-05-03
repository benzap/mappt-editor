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
void Mappt::MapptManager::addEntrance(guidType first, guidType second) {
    this->entrances.push_back(std::make_pair(first, second));
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
void Mappt::MapptManager::addMap(Map map) {
    this->maps.push_back(map);
}

void Mappt::MapptManager::removeMapByName(std::string mapName) {

}

Mappt::Map* Mappt::MapptManager::getMapByName(std::string mapName) {
    for (auto& map : this->maps) {
	if (map.getName() == mapName) {
	    return &map;
	}
    }
    return nullptr;
}

bool Mappt::MapptManager::hasMapByName(std::string mapName) {
    return false;
}

const std::vector<Mappt::Map>& Mappt::MapptManager::getMaps() {
    return this->maps;
}

	
//helper functions
bool Mappt::MapptManager::hasPoint(guidType pointId) {
    return false;
}

Mappt::Point* Mappt::MapptManager::getPoint(guidType pointId) {
    return nullptr;
}

void Mappt::MapptManager::removePoint(guidType pointId) {
    
}


//Initialization / Loading / Clearing
void Mappt::MapptManager::loadXmlString(std::string) {

}

void Mappt::MapptManager::loadJsonString(std::string) {

}

void Mappt::MapptManager::clear() {

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

