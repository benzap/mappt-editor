#include "Point.hpp"

Mappt::Point::Point() {

}

//getters / setters
const Mappt::guidType& Mappt::Point::getId() {
    return this->pointid;
}

void Mappt::Point::setId(Mappt::guidType value) {
    this->pointid = value;
}


const std::vector<float>& Mappt::Point::getPosition() {
    return this->position;
}

void Mappt::Point::setPosition(std::vector<float> value) {
    assert(value.size() == 3);

    this->position = value;
}

void Mappt::Point::setTag(std::string key, std::string value) {
    this->tags[key] = value;
}

bool Mappt::Point::hasTag(std::string key) {
    if (tags.find(key) != tags.end()) {
	return true;
    }
    return false;
}

std::string Mappt::Point::getTag(std::string key) {
    return tags[key];
}

void Mappt::Point::deleteTag(std::string key) {
    tags.erase(key);
}
