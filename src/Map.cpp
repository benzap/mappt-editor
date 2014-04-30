#include "Map.hpp"

Mappt::Map::Map() {

}

const std::string& Mappt::Map::getName() {
    return this->name;
}

void Mappt::Map::setName(std::string value) {
    this->name = value;
}


const std::string& Mappt::Map::getDescription() {
    return this->description;
}

void Mappt::Map::setDescription(std::string value) {
    this->description = value;
}


const pointContainerType& Mappt::Map::getPointContainer() {
    return this->points;
}

void Mappt::Map::addPoint(Point point) {
    this->points.push_back(point);
}

bool Mappt::Map::hasPoint(guidType pointid) {
    for (auto point : this->points) {
	if (point.getId() == pointid) {
	    return true;
	}
    }
    return false;
}

void Mappt::Map::removePoint(int index) {
    assert(index >= 0);
    this->points.erase(this->points.begin() + index);
}

void Mappt::Map::removePoint(guidType pointid) {
    std::remove_if(this->points.begin(), this->points.end(),
		   [=] (Mappt::Point point) {
		       if (point.getId() == pointid) {
			   return true;
		       }
		       return false;
		   });
}

Mappt::Point* Mappt::Map::getPointById(guidType pointid) {
    auto point = std::find_if(this->points.begin(), this->points.end(),
			      [=] (Mappt::Point point) {
				  if (point.getId() == pointid) {
				      return true;
				  }
				  return false;
			      });
    return &(*point);
}

std::vector<Mappt::Point*> Mappt::Map::getPointsByTag(std::string key) {
    auto pointContainer = std::vector<Point*>();
    for (auto point : this->points) {
	if (point.hasTag(key)) {
	    pointContainer.push_back(&point);
	}
    }
    return pointContainer;
}


const linkContainerType& Mappt::Map::getLinkContainer() {
    return this->links;
}

void Mappt::Map::addLink(guidType firstPoint, guidType secondPoint) {
    auto pointPair = std::make_pair(firstPoint, secondPoint);
    this->links.push_back(pointPair);
}

bool Mappt::Map::hasLink(guidType firstPoint, guidType secondPoint) {
    for (auto link : this->links) {
	if (link.first == firstPoint && link.second == secondPoint ||
	    link.first == secondPoint && link.second == firstPoint) {
	    return true;
	}
    }
    return false;
}

void Mappt::Map::removeLink(int index) {
    assert(index >= 0);
    this->links.erase(this->links.begin() + index);
}

void Mappt::Map::removeLink(guidType firstPoint, guidType secondPoint) {
    std::remove_if(this->links.begin(), this->links.end(),
		   [=] (linkPair link) {
		       if (link.first == firstPoint && link.second == secondPoint ||
			   link.first == secondPoint && link.second == firstPoint) {
			   return true;
		       }
		       return false;
		   });
}

void Mappt::Map::removeAllLinks(guidType pointid) {
    std::remove_if(this->links.begin(), this->links.end(),
		   [=] (linkPair link) {
		       if (link.first == pointid || link.second == pointid) {
			   return true;
		       }
		       return false;
		   });
}

const std::vector<linkPair> Mappt::Map::getLinks(guidType pointid) {
    auto linkContainer = std::vector<linkPair>();
    for (auto link : this->links) {
	
    }
    return linkContainer;
}

	
const std::vector<float>& Mappt::Map::getDimensions() {
    return this->dimensions;
}

void Mappt::Map::setDimensions(std::vector<float>& value) {
    assert(value.size() == 3);
    this->dimensions = value;
}


const std::vector<Mappt::Image>& Mappt::Map::getImageContainer() {
    return this->images;
}

void Mappt::Map::addImage(Mappt::Image image) {
    this->images.push_back(image);
}
