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
    auto& mapOne = mapptManager.newMap("Shuniah");

    auto& p11 = mapOne.newPoint();
    auto& p12 = mapOne.newPoint();
    auto& p13 = mapOne.newPoint();

    mapOne.addLink(p11.getId(), p12.getId());
    mapOne.addLink(p11, p13);

    //Map Two
    auto& mapTwo = mapptManager.newMap("Aerial");

    auto& p21 = mapTwo.newPoint();
    auto& p22 = mapTwo.newPoint();
    auto& p23 = mapTwo.newPoint();
   
    mapTwo.addLink(p21, p22);
    mapTwo.addLink(p21, p23);

    //Map Three
    auto& mapThree = mapptManager.newMap("Shuniah2");

    auto& p31 = mapThree.newPoint();
    auto& p32 = mapThree.newPoint();
    auto& p33 = mapThree.newPoint();

    mapThree.addLink(p31, p32);
    mapThree.addLink(p31, p33);

    //make entrance relationships
    //mapptManager.addEntrance(p11, p21);
    //mapptManager.addEntrance(p12, p22);
    //mapptManager.addEntrance(p21, p31);
    //mapptManager.addEntrance(p22, p32);

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
