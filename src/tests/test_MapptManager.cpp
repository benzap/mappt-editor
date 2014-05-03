#include "test.hpp"
#include "mappt.hpp"

//Helper function which returns a pointer to the stored point within the map
int main() {
    TEST_NAME();

    auto mapptManager = Mappt::MapptManager();
    
    mapptManager.setName("Marlena");

    TEST_BOOL(mapptManager.getName() == "Marlena", "setName");

    //make two competing maps that have entrance relationships
    
    std::cout << "More Tests -4" << std::endl;

    //Map One
    auto mapOne = mapptManager.newMap("Shuniah");
    auto p11 = mapOne->newPoint();
    p11->setTag("Elevator", "true");
    
    std::cout << "More Tests -3" << std::endl;

    auto p12 = mapOne->newPoint();
    auto p13 = mapOne->newPoint();
    p13->setTag("Elevator", "false");

    mapOne->addLink(p11, p12);
    mapOne->addLink(p11, p13);

    std::cout << "More Tests -2" << std::endl;

    //Map Two
    auto mapTwo = mapptManager.newMap("Aerial");
    std::cout << "More Tests -1.7" << std::endl;

    auto p21 = mapTwo->newPoint();
    auto p22 = mapTwo->newPoint();
    auto p23 = mapTwo->newPoint();
 
    std::cout << "More Tests -1.5" << std::endl;
   
    mapTwo->addLink(p21, p22);
    mapTwo->addLink(p21, p23);

    std::cout << "More Tests -1" << std::endl;

    //Map Three
    auto mapThree = mapptManager.newMap("Shuniah2");
    auto p31 = mapThree->newPoint();
    auto p32 = mapThree->newPoint();
    auto p33 = mapThree->newPoint();

    std::cout << "More Tests 0" << std::endl;

    mapThree->addLink(p31, p32);
    mapThree->addLink(p31, p33);

    std::cout << "More Tests 1" << std::endl;

    //make entrance relationships
    mapptManager.addEntrance(p11, p21);
    mapptManager.addEntrance(p12, p22);
    mapptManager.addEntrance(p21, p31);
    mapptManager.addEntrance(p22, p32);
    
    std::cout << "More Tests 2" << std::endl;

    TEST_BOOL(mapptManager.getMapByName("Shuniah")->getName() == mapOne->getName(),
	      "getMapByName");
    TEST_BOOL(mapptManager.hasPoint(p11->getId()), "hasPoint");
    TEST_BOOL(mapptManager.getPoint(p11->getId())->getId() == p11->getId(), "getPoint");


    return 0;
}
