/*
  MpptEditor is a drop-in editor to produce layouts and points on a
map. This information can be used to provide data for path traversal
applications.

Dependencies:
- Raphael
- JQuery

Class Structures:
- PointInfoElement
- PointInfoManager
- AreaLayoutManager
- AreaLayoutElement
- MapptEditor

*/

//MapptEditor Configuration Variables
var Mappt_Toolbar_Padding = 50;
var Mappt_List_Padding = 100;

//The state of the editor, used by events
// Init
// Label
// Layout
// Place-Door
// Place-Walk
// Connect-Node
var Mappt_State = "Init";

function guid() {
    s4 = function() {
	return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);}
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

//Class structure used to represent points on the map
PointInfoElement = function(xPosition, yPosition, type) {
    this.position = [xPosition, yPosition];
    this.uuid = guid();
    this.bros = [];
    this.type = type;
}

//Manager used to store all of the points being represented on the map
PointInfoManager = function() {
    this.PointInfoElementList = [];
}

PointInfoManager.prototype.addPoint = function(elem) {
    //TODO: check if it is a PointInfoElement
    this.PointInfoElementList.push(elem);
}

PointInfoManager.prototype.removePoint = function(uuid) {
    var thePoint = _.find(this.PointInfoElementList, function(elem) {
	return (elem.uuid == uuid);
    });
    var index = this.PointInfoElementList.indexOf(thePoint);
    this.PointInfoElementList.splice(index,1);
}

PointInfoManager.prototype.getPointByUUID = function(uuid) {
    var thePoint = _.find(this.PointInfoElementList, function(elem) {
	return (elem.uuid == uuid);
    });
    return thePoint;
}

PointInfoManager.prototype.getAllPoints = function() {
    return this.PointInfoElementList;
}

//Used to represent areas within the map
AreaLayoutElement = function(label) {
    this.label = label;
    this.uuid = guid();
    this.doors = [];
    this.vertexList = [] //[x,y]
}

//Used to manage the areas within the map
AreaLayoutManager = function() {
    this.AreaLayoutElementList = []
}

AreaLayoutManager.prototype.addLayout = function(elem) {
    this.AreaLayoutElementList.push(elem);
}

AreaLayoutManager.prototype.removeLayout = function(uuid) {
    var thePoint = _.find(this.AreaLayoutElementList, function(elem) {
	return (elem.uuid == uuid);
    });
    var index = this.AreaLayoutElementList.indexOf(thePoint);
    this.AreaLayoutElementList.splice(index,1);
}

AreaLayoutManager.prototype.getLayoutByUUID = function(uuid) {
    var thePoint = _.find(this.AreaLayoutElementList, function(elem) {
	return (elem.uuid == uuid);
    });
    return thePoint;
}

AreaLayoutManager.prototype.getAllLayouts = function() {
    return this.AreaLayoutElementList;
}

//Main Class that needs to be initialized
MapptEditor = function (context_id, context_width, context_height, imageURL) {
    //The id of the DIV element to place our MapptEditor
    this.context_id = context_id;
    //The width of our Raphael paper
    this.context_width = context_width;
    //The height of our Raphael paper
    this.context_height = context_height;

    //our current context
    this.contextObj = $("#" + context_id);

    //check if the given ID exists
    (this.contextObj.length) || 
	console.log("ERROR: Provided ID does not match any element within the DOM");

    //get the origin of our context in order to draw on the paper correctly
    this.contextOffset = this.contextObj.offset();


    //The image URL
    this.imageURL = typeof imageURL !== 'undefined' ? imageURL : null;

    //The image object
    this.imageObject = new Image();
    
    this.imageObject.onload = function() {

    }

    this.imageObject.onerror = function() {
	console.log("ERROR: the imageURL provided does not exist");
    }

    //Allocate our image if it exists
    if (this.imageURL != null) {
	this.imageObject.src = this.imageURL;
    }

    this.imageObject.width = this.context_width;
    this.imageObject.height = this.context_height;	    

    //contains the paper for our Raphael
    this.context_paper = null;
    //contains the image for our paper
    this.context_image = null;

    //data managers used to contain the room layouts and nodes
    this.areaLayoutManager = new AreaLayoutManager();
    this.pointInfoManager = new PointInfoManager();
    
    //relation table, which contains pairs of (uuid, paper.circle)
    this.paperPoints = []
    //relation table, which contains pairs of (uuid, [paper.path])
    this.paperAreas = []
}

MapptEditor.prototype.setImage = function(imageURL) {
    (this.imageURL != null) || 
	console.log("ERROR: Provided input is not a URL");
    this.imageURL = imageURL;
    this.imageObject.src = imageURL;
}

MapptEditor.prototype.init = function() {
    (this.imageURL) ||
	console.log("ERROR: No Image was provided");
    this.context_paper = Raphael(this.context_id, this.context_width, this.context_height);

    this.context_image = this.context_paper.image(this.imageURL, 
				     0, 0,
				     this.context_width,
				     this.context_height);
    this.contextObj.css(
	{
	    width: this.context_width, 
	    height: this.context_height,
	    position: "relative",
	});

    this.context_image.click(function(e) {
	var xPosition = e.clientX - mappt.contextOffset.left;
	var yPosition = e.clientY - mappt.contextOffset.top;
	alert(xPosition.toString() + " " + yPosition.toString());
	mappt.createPoint(xPosition, yPosition, "DOOR");
    }.bind(this));
}

MapptEditor.prototype.createPoint = function(xPosition, yPosition, type) {
    if (type == "DOOR") {
	//set of attributes
    }
    else if (type == "WALK") {
	//set of attributes
    }
    
    //create the paper point
    var paperPoint = this.context_paper.circle(
	xPosition, yPosition, 5)
	.attr("fill", "#ff0000");
    
    //create the data point
    var dataPoint = new PointInfoElement(
	xPosition, yPosition, type);
    
    //store the data point in our manager
    this.pointInfoManager.addPoint(dataPoint);
    
    //store both in our relation table
    this.paperPoints.push([dataPoint.uuid, paperPoint]);

}

mapTrack = function (jqobj, img) {

    var width = jqobj.width(); 
    var height = jqobj.height() || jqobj.width();
    var paper = Raphael(jqobj[0], this.w, this.h);


    var map = paper.image(img, 0, 0, width, height);
    var points = [];

    map.click(function(e){
	points.push(paper.circle(e.clientX, e.clientY, 10).attr("fill","#ff0000"));
    });

    this.mouseover = function (e) {
    }
    this.mouseout = function (e) {
    }    
};

mappt = new MapptEditor("mappt-editor-main", 1024, 768, "img/floor.png");
mappt.init();

areaLayoutManager = new AreaLayoutManager();
someArea = new AreaLayoutElement("351");

areaLayoutManager.addLayout(someArea);
console.log(areaLayoutManager.getAllLayouts().length);
areaLayoutManager.removeLayout(someArea.uuid);
console.log(areaLayoutManager.getAllLayouts().length);

somePoint = new PointInfoElement(0,10,"DOOR");
pointInfoManager = new PointInfoManager();

pointInfoManager.addPoint(somePoint);
console.log(pointInfoManager.getAllPoints().length);
pointInfoManager.removePoint(somePoint.uuid);
console.log(pointInfoManager.getAllPoints().length);