#include "Map.hpp"

Mappt::Map::Map() {

}

const std::string& Mappt::Map::getName() {
    return this->name;
}

void Mappt::Map::setName(std::string value) {
    this->name = value;

    //make sure we update the map name tag within the points when we
    //change the name of our map
    for (auto point : this->points) {
	point.setTag("MapName", this->name);
    }

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

Mappt::Point& Mappt::Map::newPoint() {
    auto point = Mappt::Point();
    point.setTag("MapName", this->name);
    this->points.push_back(point);
    return this->points.back();
}

void Mappt::Map::addPoint(Point point) {
    //assign the map name within the point tags
    point.setTag("MapName", this->name);
    
    this->points.push_back(point);
}

bool Mappt::Map::hasPoint(guidType pointid) {
    for (auto& point : this->points) {
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

Mappt::Point& Mappt::Map::getPointById(guidType pointid) {
    for (auto& point : this->points) {
	if (point.getId() == pointid) {
	    return point;
	}
    }

    throw MapptException("Mappt::Map::getPointById",
			 "Failed to get point with id " + pointid);
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

void Mappt::Map::addLink(guidType firstGuid, guidType secondGuid) {
    this->links.push_back(std::make_pair(firstGuid, secondGuid));
}

void Mappt::Map::addLink(Mappt::Point firstPoint, Mappt::Point secondPoint) {
    auto link = std::make_pair(firstPoint.getId(), secondPoint.getId());
    this->links.push_back(link);
}

bool Mappt::Map::hasLink(guidType firstGuid, guidType secondGuid) {
    for (auto link : this->links) {
	if (link.first == firstGuid && link.second == secondGuid ||
	    link.first == secondGuid && link.second == firstGuid) {
	    return true;
	}
    }
    return false;
}

void Mappt::Map::removeLink(int index) {
    assert(index >= 0);
    this->links.erase((this->links.begin() + index));
}

void Mappt::Map::removeLink(guidType firstGuid, guidType secondGuid) {
    auto erasedLink = std::find_if(this->links.begin(),
				   this->links.end(),
				   [=] (linkPair link) {
				       if (link.first == firstGuid &&
					   link.second == secondGuid ||
					   link.first == secondGuid &&
					   link.second == firstGuid) {
					   return true;
				       }
				       return false;
				   });
    
    if (erasedLink != this->links.end()) {
	this->links.erase(erasedLink);
    }
    
}

void Mappt::Map::removeAllLinks(guidType pointid) {
    auto erasedLink = std::find_if(this->links.begin(),
				   this->links.end(),
				   [=] (linkPair link) {
				       if (link.first == pointid ||
					   link.second == pointid) {
					   return true;
				       }
				       return false;
				   });
    
    if (erasedLink != this->links.end()) {
	this->links.erase(erasedLink);
    } 
}

const std::vector<linkPair> Mappt::Map::getLinks(guidType pointid) {
    auto linkContainer = std::vector<linkPair>();
    for (linkPair link : this->links) {
	
    }
    return linkContainer;
}

const std::vector<float>& Mappt::Map::getDimensions() {
    return this->dimensions;
}

void Mappt::Map::setDimensions(std::vector<float> value) {
    assert(value.size() == 3);
    this->dimensions = value;
}


const std::vector<Mappt::Image>& Mappt::Map::getImageContainer() {
    return this->images;
}

void Mappt::Map::addImage(Mappt::Image image) {
    this->images.push_back(image);
}
