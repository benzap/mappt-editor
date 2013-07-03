'''This file is used to take in a map layout with the correctly names layers for
the boundary and the rooms, and apply styling based on what is specified
within the variables listed at the top of the page.

This file also corrects for several other issues involved when using
inkscape to develop the svg's, along with other formatting. One major
requirement for this setup is that each each layer must consist of
paths. To ensure that they are the same path, everything in a specific
layer is selected and combined into a single path.

Corrections:     

- inkscape:label within the group, is assigned to the group 'id' attribute

Formatting:

- Labels opacity is decreased a bit.
- We ensure that the Layout layer is not visible, and ensure that it is locked

'''
from xml.dom import minidom
import sys
from svgTools import parseStyle
from svgTools import encodeStyle


label_rooms = "Rooms"
pathStyleData_rooms = {
	"fill":"none",
	"stroke":"#55c0cc",
	"stroke-width":"1px",
	"stroke-linecap":"round",
	"stroke-linejoin":"round",
	"stroke-opacity":"1",
	"marker-start":"none",
	"display":"inline",
}

label_boundary = "Boundary"
pathStyleData_boundary = {
	"fill":"none",
	"stroke":"#46b7c1",
	"stroke-width":"3px",
	"stroke-linecap":"round",
	"stroke-linejoin":"round",
	"stroke-miterlimit":"4",
	"stroke-opacity":"1",
	"stroke-dasharray":"none",
}

#The label label
label_Label = "Labels" #...
pathStyleData_label = {
	"opacity" : "0.5",
}

#plan on deleting this...
label_layout = "Layout"
pathStyleData_layout = {
        "opacity" : "0.3",
        "display" : "none",
}

def addStyling(domObj, pathStyleData):
	for item in domObj:
		if item.hasAttribute("style"):
			style = item.getAttribute("style")
			styleData = parseStyle(style)
			print styleData
			styleData.update(pathStyleData)
			item.setAttribute("style", encodeStyle(styleData))
			print styleData

if __name__ == "__main__":
	if len(sys.argv) == 2:
	    filename = sys.argv[1];
	else:
	    raise Exception("Need to provide a filename")

	print "Parsing {}...".format(filename)
	xmldoc = minidom.parse(filename)

	groupList = xmldoc.getElementsByTagName('g')

	for group in groupList:
		if group.hasAttribute("inkscape:label"):
			label = group.getAttribute("inkscape:label")
			#apply our inkscape label to the id of our group
			group.setAttribute("id", label)
			pathList = group.getElementsByTagName("path")
			#if we have a boundary group, apply our boundary style
			if label == label_boundary:
				addStyling(pathList, pathStyleData_boundary)
			elif label == label_rooms:
				addStyling(pathList, pathStyleData_rooms)
			elif label == label_Label:
                                # add styling to the group
                                addStyling([group], { "opacity" : "1.0", "display" : "inline" })
				textList = group.getElementsByTagName("text")
				addStyling(textList, pathStyleData_label)
			elif label == label_layout:
                                addStyling([group], pathStyleData_layout)
                        else:
                                print "Unexpected label '{}'".format(label)


	#grab all of the paths
	#itemList = xmldoc.getElementsByTagName('path')

        


	#addStyling(itemList, pathStyleData_rooms)
	outputString = xmldoc.toxml()
	outputFile = open(filename+".svg", 'w')
	outputFile.write(outputString)
