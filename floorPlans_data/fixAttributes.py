from json import dumps as stringify
from json import loads as encode
import sys

def fixAttributes(filename):
    filehandle = open(filename, 'r')
    jsonObj = encode(filehandle.read())
    
    #close our filehandle
    filehandle.close()

    pointinfolist = []
    linkinfolist = []

    for point in jsonObj["PointInfoList"]:
        if point.has_key("position"):
            point["px"] = point["position"][0]
            point["py"] = point["position"][1]

        pointinfolist.append(point)

    jsonObj["PointInfoList"] = pointinfolist

    for link in jsonObj["LinkInfoList"]:
        if type(link) == list:
            link = {
                0:link[0],
                1:link[1],
                "first":link[0],
                "second":link[1],
            }
            linkinfolist.append(link)
    jsonObj["LinkInfoList"] = linkinfolist

    #place our new json object within the file
    fileoutput = open(filename, 'w')
    fileoutput.write(stringify(jsonObj))



if __name__ == "__main__":
    if not len(sys.argv) > 1:
        raise Exception("did not provide a file to scrape values from");

    filename = sys.argv[1]
    fixAttributes(filename)
