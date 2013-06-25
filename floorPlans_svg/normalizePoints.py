from xml.dom import minidom
import sys
from svgTools import parsePath_d_attribute as parsePath


THRESHOLD = 1.0

if len(sys.argv) == 2:
    filename = sys.argv[1];
else:
    raise Exception("Need to provide a filename")

xmldoc = minidom.parse(filename)

#grab all of the paths
itemlist = xmldoc.getElementsByTagName('path')

#we are assuming that all paths have been combined into a big path, so
#that we align based on each group
pointLists = []
for item in itemlist:
    if item.hasAttribute("d"):
        dString = item.getAttribute("d")
        pointLists.append(parsePath(dString))
