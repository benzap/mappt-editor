from xml.dom import minidom
import sys

layerRemoval = [
    "0",
    "TEXT",
    #"WALLS",
    "FURN",
    "SOLID",
    "TITLEBLOCK",
    "EMERG_",
    "VP",
    #"STAIR",
    "GRID",
    "DEFPOINTS",
    "CORRIDORS",
    "FURN_NEW_SOLID",
    "PLUMBING",
    "MPFIXTURE",
    "AIRCRAFTDIMENSION",
    "BUILDING_PERIMETER",
    "WALL_NEW",
    "DIM",
    "COMPUTER",
    "FURN_NEW",
    "HIGHLIGHT",
    "BORDER",
    "DIMENSIONS",
    "TEXT_E_",
    "LAYER1",
    "BAR_SCALE",
    "G-IMPT",
    "P-SANR-FIXT-E",
    "S-COLS",
    "A-FLOR-CASE",
    #"ROOM_NAMES",
    "DOORS",
    "EQUIPMENT",
    "EXIST",
    "A-WALL-E",
    "S-COLS-E",
    "A-WALL",
    "A-DOOR",
    "A-EQPM",
    "A-AREA-IDEN",
    "A-DETL",
    "A-EQPM-IDEN",
    "1-STUDENT_DESKS",
    "HVAC_EXIST",
    "WALL_NEWHATCH",
    "ELECT_EXIST",
    "TEXT_NEW",
    "FLOOR_NEW",
    #"ROOM_NUMBER",
    "HATCH_CORRIDOR",
    "2-STUDENT_CHAIRS",
    "5-STUDY_TABLE",
    "8-2_SEAT_OTTOMAN",
    #"WALL",
    "CORRIDOR_HATCH",
    "CEILING",
    "CRAWLSPACE_ACCESS",
    "58",
    ]

if len(sys.argv) == 2:
    filename = sys.argv[1];
else:
    raise Exception("Need to provide a filename")

xmldoc = minidom.parse(filename)
itemlist = xmldoc.getElementsByTagName('g')

for item in itemlist:
    if item.attributes["inkscape:label"].value in layerRemoval:
        item.parentNode.removeChild(item)
        if item.hasAttribute("style"):
            item.setAttribute("style", "display:none")

outputString = xmldoc.toxml()
outputFile = open(filename, 'w')
outputFile.write(outputString)
