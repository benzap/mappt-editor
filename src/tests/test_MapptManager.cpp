#include "test.hpp"
#include "mappt.hpp"

//Helper function which returns a pointer to the stored point within the map
Mappt::Point* addPoint(Mappt::Map* map) {
    auto point = Mappt::Point();
    auto id = point.getId();

    map->addPoint(point);
    return map->getPointById(id);
}

int main() {
    TEST_NAME();

    auto mapptManager = Mappt::MapptManager();
    
    mapptManager.setName("Marlena");

    TEST_BOOL(mapptManager.getName() == "Marlena", "setName");

    //make two competing maps that have entrance relationships
    
    //First Map
    auto mapOne = mapptManager.newMap("Shuniah");
    auto p11 = addPoint(mapOne);
    p11->setTag("Elevator", "true");
    
    auto p12 = addPoint(mapOne);
    auto p13 = addPoint(mapOne);

    //Map Two
    auto mapTwo = mapptManager.newMap("Aerial");
    auto p21 = addPoint(mapTwo);
    auto p22 = addPoint(mapTwo);
    auto p23 = addPoint(mapTwo);
    
    //make entrance relationships
    mapptManager.addEntrance(p11->getId(), p21->getId());
    mapptManager.addEntrance(p11->getId(), p22->getId());




    return 0;

}
