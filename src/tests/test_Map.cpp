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
    TEST_BOOL(getPoint.getId() == testPoint3.getId(), "getPointById");
    
    auto tagPoint1 = Mappt::Point();
    tagPoint1.setTag("elevator", "true");
    tagPoint1.setTag("stairs", "false");
    map.addPoint(tagPoint1);
    
    
    auto tagPoint2 = Mappt::Point();
    tagPoint2.setTag("elevator", "false");
    tagPoint2.setTag("department", "science");
    map.addPoint(tagPoint2);
    
    auto tagPoint3 = Mappt::Point();
    tagPoint3.setTag("stairs", "true");
    map.addPoint(tagPoint3);
    
    auto elevatorTags = map.getPointsByTag("elevator");
    TEST_BOOL(elevatorTags.size() == 2, "getPointsByTag");

    //Links
    map.addLink(tagPoint1.getId(), tagPoint2.getId());

    TEST_BOOL(map.getLinkContainer().size() == 1, "getLinkContainer");
    TEST_BOOL(map.hasLink(tagPoint1.getId(), tagPoint2.getId()), "hasLink");
    
    map.addLink(tagPoint1.getId(), tagPoint3.getId());
    map.addLink(tagPoint2, tagPoint3);

    map.removeLink(0);

    TEST_BOOL(!map.hasLink(tagPoint1.getId(), tagPoint2.getId()),
	      "removeLink(index)");

    map.addLink(tagPoint1.getId(), tagPoint2.getId());
    map.removeLink(tagPoint1.getId(), tagPoint2.getId());

    TEST_BOOL(!map.hasLink(tagPoint1.getId(), tagPoint2.getId()),
	      "removeLink(link)");

    map.addLink(tagPoint1, tagPoint2);

    map.removeAllLinks(tagPoint1.getId());

    TEST_BOOL(!map.hasLink(tagPoint1.getId(), tagPoint2.getId()),
	      "removeAllLinks 1");

    TEST_BOOL(!map.hasLink(tagPoint1.getId(), tagPoint3.getId()),
    	      "removeAllLinks 1");

    //Dimensions
    map.setDimensions({600, 400, 0});
    TEST_BOOL(map.getDimensions() == std::vector<float>({600, 400, 0}),
	      "getDimensions");
    
    auto& p11 = map.newPoint();
    auto& p12 = map.newPoint();

    map.addLink(p11, p12);

    TEST_BOOL(map.hasPoint(p11.getId()), "hasPoint2");
    TEST_BOOL(map.getPointById(p11.getId()).getId() == p11.getId(), "getPointById2");


    return 0;
}
