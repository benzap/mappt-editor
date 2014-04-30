#include "test.hpp"
#include "mappt.hpp"

int main() {
    TEST_NAME();

    auto map = Mappt::Map();

    TEST_BOOL(map.getName() == "None", "getName");
    map.setName("Awesome Map");
    TEST_BOOL(map.getName() == "Awesome Map", "setName");

    TEST_BOOL(map.getDescription() == "None", "getDescription");
    map.setDescription("This is an awesome map");
    TEST_BOOL(map.getDescription() == "This is an awesome map",
	      "setDescription");

    TEST_BOOL(map.getPointContainer().size() == 0,
	      "getPointContainer 1");
    auto testPoint1 = Mappt::Point();
    map.addPoint(testPoint1);
    
    TEST_BOOL(map.getPointContainer().size() == 1,
	      "getPointContainer 2");

    auto testPoint2 = Mappt::Point();
    map.addPoint(testPoint2);
    auto testPoint3 = Mappt::Point();
    map.addPoint(testPoint3);
    
    TEST_BOOL(map.hasPoint(testPoint2.getId()), "hasPoint (true)");

    map.removePoint(0);
    TEST_BOOL(!map.hasPoint(testPoint1.getId()), "removePoint(index)");

    map.removePoint(testPoint2.getId());
    TEST_BOOL(!map.hasPoint(testPoint2.getId()), "removePoint(guid)");

    auto getPoint = map.getPointById(testPoint3.getId());
    TEST_BOOL(getPoint->getId() == testPoint3.getId(), "getPointById");
    
    auto tagPoint1 = Mappt::Point();
    tagPoint1.addTag("elevator", "true");
    tagPoint1.addTag("stairs", "false");
    map.addPoint(tagPoint1);
    
    
    auto tagPoint2 = Mappt::Point();
    tagPoint2.addTag("elevator", "false");
    tagPoint2.addTag("department", "science");
    map.addPoint(tagPoint2);
    
    auto tagPoint3 = Mappt::Point();
    tagPoint3.addTag("stairs", "true");
    map.addPoint(tagPoint3);
    
    auto elevatorTags = map.getPointsByTag("elevator");
    TEST_BOOL(elevatorTags.size() == 2, "getPointsByTag");

    
    
    return 0;
}
