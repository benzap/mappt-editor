from json import dumps as stringify
from json import loads as encode
import sys

scrappedAttributes = [
    "mapUp_url", "mapUp_links", "mapUp_elevation", 
    "mapDown_url", "mapDown_links", "mapDown_elevation", 
    "mapEntrance_url", "mapEntrance_links",
    "tags", "type",
]

def scrapeAttributes(filename):
    filehandle = open(filename, 'r')
    jsonObj = encode(filehandle.read())
    
    #close our filehandle
    filehandle.close()
    
    for point in jsonObj["PointInfoList"]:
        for scrapeAttribute in scrappedAttributes:
            if scrapeAttribute in point.keys():
                point.pop(scrapeAttribute, None);
                
    #place our new json object within the file
    fileoutput = open(filename, 'w')
    fileoutput.write(stringify(jsonObj))

if __name__ == "__main__":
    if not len(sys.argv) > 1:
        raise Exception("did not provide a file to scrape values from");
        
    filename = sys.argv[1]
    scrapeAttributes(filename)
