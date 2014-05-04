#include <iostream>

#include "test.hpp"
#include "mappt.hpp"

//Helper function which returns a pointer to the stored point within the map
int main() {
    TEST_NAME();

    auto mapptManager = Mappt::MapptManager();
    
    mapptManager.setName("Conmap");

    TEST_BOOL(mapptManager.getName() == "Conmap", "setName");

    //Map One
    Mappt::Map& mapOne = mapptManager.newMap("Shuniah");

    Mappt::Point& p11 = mapOne.newPoint();
    Mappt::Point& p12 = mapOne.newPoint();
    Mappt::Point& p13 = mapOne.newPoint();

    mapOne.addLink(p11.getId(), p12.getId());
    mapOne.addLink(p11, p13);

    //Map Two
    Mappt::Map& mapTwo = mapptManager.newMap("Aerial");

    Mappt::Point& p21 = mapTwo.newPoint();
    Mappt::Point& p22 = mapTwo.newPoint();
    Mappt::Point& p23 = mapTwo.newPoint();
   
    mapTwo.addLink(p21, p22);
    mapTwo.addLink(p21, p23);

    //Map Three
    Mappt::Map& mapThree = mapptManager.newMap("Shuniah2");

    Mappt::Point& p31 = mapThree.newPoint();
    Mappt::Point& p32 = mapThree.newPoint();
    Mappt::Point& p33 = mapThree.newPoint();

    mapThree.addLink(p31, p32);
    mapThree.addLink(p31, p33);

    //make entrance relationships
    mapptManager.addEntrance(p11, p21);
    std::cout << "test4" << std::endl;
    mapptManager.addEntrance(p12, p22);
    mapptManager.addEntrance(p21, p31);
    mapptManager.addEntrance(p22, p32);

    

    TEST_BOOL(mapptManager.getMapByName("Shuniah").getName() == mapOne.getName(),
	      "getMapByName");

    TEST_BOOL(mapptManager.hasPoint(p11.getId()), "hasPoint");

    try {
	auto p11_b = mapptManager.getPoint(p11.getId());
	TEST_BOOL(mapptManager.getPoint(p11.getId()).getId() == p11.getId(),
		  "getPoint");
    }
    catch(Mappt::MapptException ex) {
	std::cout << ex.what() << std::endl;
    }
    catch(...) {
	std::cout << "Received Unknown Exception" << std::endl;
    }

    return 0;
}
