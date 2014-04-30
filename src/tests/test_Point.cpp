#include "test.hpp"

int main() {
    TEST_NAME();

    auto point = Mappt::Point();

    auto guid = Mappt::generateGUID();
    point.setId(Mappt::generateGUID());

    TEST_BOOL(guid != point.getId(), "getId");

    point.setId(guid);

    TEST_BOOL(guid == point.getId(), "setId");
 
    point.setPosition({1.0, 0.0, 0.0});
    
    TEST_BOOL(point.getPosition() == std::vector<float>({1.0,0.0,0.0}), "setPosition");
    
    TEST_BOOL(point.getPosition()[0] == 1.0, "getPosition");

    point.addTag("floor", "1");
    point.addTag("Ben", "awesome");

    TEST_BOOL(point.hasTag("stupid") != true, "hasTag (false)");
    TEST_BOOL(point.hasTag("Ben") == true, "hasTag(true)");

    TEST_BOOL(point.getTag("Ben") == "awesome", "getTag");

    point.deleteTag("floor");
    
    TEST_BOOL(point.hasTag("floor") == false, "deleteTag");
    return 0;
}
