'''
Includes a bunch of tools to fix up an svg file, and parse pieces that
would normally be a lot more difficult to parse

PathPoint represents a point on the path within an svg Path element

MoveToAbsolute is a slightly different MoveTo point
MoveTo is a moveto point
LineTo is a lineto point
ClosePath is a closepath point

http://www.w3.org/TR/SVG/paths.html#Introduction


'''
import re

class PathPoint:
    def __init__(self, position = [0., 0.]):
        self.position = position
        self.theType = ""
        self.__repr__ = self.__str__


    def __str__(self):
        return "{0[0]:f},{0[1]:f} ".format(self.position);

class MoveTo(PathPoint):
    def __init__(self, position = [0., 0.]):
        PathPoint.__init__(self, position)
        self.theType = "m"
        
    def __str__(self):
        return "m " + PathPoint.__str__(self)

class MoveToAbsolute(PathPoint):
    def __init__(self, position = [0., 0.]):
        PathPoint.__init__(self, position)
        self.theType = "M"
        
    def __str__(self):
        return "M " + PathPoint.__str__(self)

class LineTo(PathPoint):
    pass

class ClosePath(PathPoint):
    def __init__(self):
        self.theType = "z"
    def __str__(self):
        return "z "

'''
Used to parse the "d" attribute within svg path strings. Returns a
list of pathpoint objects.
'''
def parsePath_d_attribute(theString):
    regex_isMoveToAbsolute = re.compile(r"^M +([-0-9]+\.?[0-9]*), ?([-0-9]+\.?[0-9]*) +")
    regex_isMoveTo = re.compile(r"^m +([-0-9]+\.?[0-9]*), ?([-0-9]+\.?[0-9]*) +")
    regex_isLineTo = re.compile(r"^l +([-0-9]+\.?[0-9]*), ?([-0-9]+\.?[0-9]*) +| *([-0-9]+\.?[0-9]*), ?([-0-9]+\.?[0-9]*) *")
    regex_isClosePath = re.compile(r"^z *")

    parsedList = []
    while len(theString):
        theString = theString.strip()
        mAbsReg = regex_isMoveToAbsolute.match(theString)
        mReg = regex_isMoveTo.match(theString)
        lReg = regex_isLineTo.match(theString)
        cReg = regex_isClosePath.match(theString)

        if mAbsReg:
            positions = [ float(i) for i in mAbsReg.groups() ]
            parsedList.append(MoveToAbsolute(positions))
            theString = theString[mAbsReg.end():]

        elif mReg:
            positions = [ float(i) for i in mReg.groups() ]
            parsedList.append(MoveTo(positions))
            theString = theString[mReg.end():]

        elif lReg:
            #filter out our None elements
            positions = filter(lambda i: i, lReg.groups())
            positions = [ float(i) for i in positions]

            parsedList.append(LineTo(positions))
            theString = theString[lReg.end():]

        elif cReg:
            parsedList.append(ClosePath())
            theString = theString[cReg.end():]

        else:
            print theString
            print "broke"
            break
        
    return parsedList

def parseStyle(styleString):
    styleDict= {}
    for styleAttribute in styleString.strip().split(";"):
        if len(styleAttribute.split(":")) == 2:
            key,val = styleAttribute.split(":")
            styleDict[key] = val
        else: continue
    return styleDict

def encodeStyle(styleDict):
    styleString = ""
    for key,val in styleDict.items():
        styleString += "{}:{};".format(key,val)
    return styleString

if __name__ == "__main__":
    x = "font-size:10px;font-style:normal;font-weight:normal;line-height:125%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;font-family:Sans"
    print parseStyle(x)
    print encodeStyle(parseStyle(x))