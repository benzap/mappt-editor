from xml.dom import minidom
import sys
from svgTools import parseStyle
from svgTools import encodeStyle

if len(sys.argv) == 2:
    filename = sys.argv[1];
else:
    raise Exception("Need to provide a filename")

pathStyleData = {
	"fill":"none",
	"stroke":"#46b7c1",
	"stroke-width":"4.5px",
	"stroke-linecap":"round",
	"stroke-linejoin":"round",
	"stroke-miterlimit":"4",
	"stroke-opacity":"1",
	"stroke-dasharray":"none",
}

print "Parsing {}...".format(filename)
xmldoc = minidom.parse(filename)

#grab all of the paths
itemlist = xmldoc.getElementsByTagName('path')

#we are assuming that all paths have been combined into a big path, so
#that we align based on each group
pointLists = []
for item in itemlist:
	if item.hasAttribute("style"):
		style = item.getAttribute("style")
		styleData = parseStyle(style)
		print styleData
		styleData.update(pathStyleData)
		item.setAttribute("style", encodeStyle(styleData))
		print styleData

outputString = xmldoc.toxml()
outputFile = open(filename, 'w')
outputFile.write(outputString)