#ifndef IMAGE__HPP
#define IMAGE__HPP
//DESCRIPTION
/*
  A class object representing an image that is being used within a
  particular map
 */

//CLASSES
namespace Mappt {
    class Image;
}

//INCLUDES
#include <string>
#include <vector>

#include "Mappt_Utils.hpp"
#include "Mappt_Globals.hpp"

//DEFINITIONS

//MACROS

//TYPEDEFS

//FUNCTIONS

//BEGIN
namespace Mappt {
    class Image {
    private:
	std::string type;
	std::vector<float> position;
	std::vector<float> scale;
	std::vector<float> rotation;
    public:
	Image();
	virtual ~Image() {}
    };
}

#endif //END IMAGE__HPP
