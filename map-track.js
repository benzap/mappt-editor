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
var Mappt_keycodes = {
    "1" : 49,
    "2" : 50,
    "3" : 51,
    "4" : 52,
    "5" : 53,
    "e" : 101,
};
//The radius of the node circles
var Mappt_Node_Radius = 5;

//Node Colors
var Mappt_Node_Color_Default = "#ff0000";
var Mappt_Node_Color_Selected = "#0000ff"
var Mappt_Node_Color_Hover = "#00ff00";

//Temporary for linking
var addLink_currentlySelected = null;
var removeLink_currentlySelected = null;

//Temporary for holding a node for modification
var selectNode_currentlySelected = null;

function guid() {
    s4 = function() {
	return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);}
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function log(t1, t2, t3, t4, t5, t6, t7, t8, t9){
    if(typeof(console)=="object"){
	var a = [t1,t2,t3,t4,t5,t6,t7,t8,t9]
	a.each(function(i,v){
            if(v!=undefined){
		if(typeof v == "object")
		    a[i] = ser(v)
            }
            else if(typeof v == "function"){
            a[i] = "function(){...}"
            }
	})
	    console.log(a.join("\t"));
    }
}

//grabs the first value from a pair contained in a list of pairs with
//the given second value
function grabFirstWhereSecond(pairList, second) {
    var tuple = _.find(pairList, function(elem) {
	return (elem[1] == second);
    });
    return tuple[0];
}

//grabs the second value from a pair contained in a list of pairs with
//the given first value
function grabSecondWhereFirst(pairList, first) {
    var tuple = _.find(pairList, function(elem) {
	return (elem[0] == first);
    });
    return tuple[1];
}

//Class structure used to represent points on the map
PointInfoElement = function(xPosition, yPosition, type) {
    this.position = [xPosition, yPosition];
    this.id = PointInfoElement.increment;
    PointInfoElement.increment += 1;
    this.uuid = guid();
    this.bros = [];
    this.type = type;
    this.room = "";
}
//Static Incrementer
PointInfoElement.increment = 0;

//Manager used to store all of the points being represented on the map
PointInfoManager = function() {
    this.PointInfoElementList = [];
}

PointInfoManager.prototype.addPoint = function(elem) {
    //TODO: check if it is a PointInfoElement
    this.PointInfoElementList.push(elem);
}

PointInfoManager.prototype.removePoint = function(id) {
    var thePoint = _.find(this.PointInfoElementList, function(elem) {
	return (elem.id == id);
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

PointInfoManager.prototype.getPointByID = function(id) {
    var thePoint = _.find(this.PointInfoElementList, function(elem) {
	return (elem.id == id);
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
	log("ERROR: Provided ID does not match any element within the DOM");

    //get the offset of our context in order to draw on the paper correctly
    this.contextOffset = this.contextObj.offset();


    //The image URL
    this.imageURL = typeof imageURL !== 'undefined' ? imageURL : null;

    //The image object
    this.imageObject = new Image();
    
    this.imageObject.onload = function() {

    }

    this.imageObject.onerror = function() {
	log("ERROR: the imageURL provided does not exist");
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
    
    //relation table, which contains pairs of (id, paper.circle)
    this.paperPoints = [];
    
    //relation table, which contains pairs of (id, [paper.path])
    this.paperAreas = [];
    //relation table, which contains pairs of (id, id, paper.path)
    this.paperLinks = [];

    //The state of the editor, used by events
    // addNode
    // removeNode
    // addLink
    // removeLink
    // selectNode
    this.state = "addNode";
}

MapptEditor.prototype.setImage = function(imageURL) {
    (this.imageURL != null) || 
	log("ERROR: Provided input is not a URL");
    this.imageURL = imageURL;
    this.imageObject.src = imageURL;
}

MapptEditor.prototype.init = function() {
    (this.imageURL) ||
	log("ERROR: No Image was provided");
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

    var mapptEditor = this;
    this.context_image.click(function(e) {
	if (mapptEditor.state == "addNode") {
	    var xPosition = e.clientX - mapptEditor.contextOffset.left +
		document.body.scrollLeft;
	    var yPosition = e.clientY - mapptEditor.contextOffset.top + 
		document.body.scrollTop;
	    mapptEditor.createPoint(xPosition, yPosition, "DOOR");
	}
	else if (mapptEditor.state == "removeNode") {
	
	}
	else if (mapptEditor.state == "addLink") {
	
	}
	else if (mapptEditor.state == "removeLink") {
	
	}
	else if (mapptEditor.state == "selectNode") {
	
	}
    }.bind(this));
    
    //upon focusing, binds global event keys to control our editor
    
    $(window).keypress(function(e) {
	if (e.keyCode == Mappt_keycodes["1"]) {
	    this.mode("addNode");
	}
	else if (e.keyCode == Mappt_keycodes["2"]) {
	    this.mode("removeNode");
	}
	else if (e.keyCode == Mappt_keycodes["3"]) {
	    this.mode("addLink");
	}
	else if (e.keyCode == Mappt_keycodes["4"]) {
	    this.mode("removeLink");
	}
	else if (e.keyCode == Mappt_keycodes["e"]) {
	    this.exportJSON(this.imageURL + ".js");
	}
	else if (e.keyCode == Mappt_keycodes["5"]) {
	    this.mode("selectNode");
	}
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
	xPosition, yPosition, Mappt_Node_Radius)
	.attr("fill", Mappt_Node_Color_Default);
    
    var mapptEditor = this;
    paperPoint.click(function(e) {
	//remove the point from the paper and from the data structure
	if (mapptEditor.state == "removeNode") {
	    var temp_paperPoint = _.find(mapptEditor.paperPoints, function(elem) {
		return (this == elem[1]);
	    }.bind(this));
	    var tempID = temp_paperPoint[0]; 
	    temp_paperPoint[1].remove();
	    mapptEditor.pointInfoManager.removePoint(tempID);
	    
	    //remove any links that include the removed node
	    mapptEditor.paperLinks = _.filter(mapptEditor.paperLinks, function(elem) {
		if (tempID == elem[0] || tempID == elem[1]) {
		    elem[2].remove();
		    return false;
		}
		return true;
	    });
	}
	else if (mapptEditor.state == "addLink") {
	    if (addLink_currentlySelected == null) {
		addLink_currentlySelected = this;
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	    else if (addLink_currentlySelected == this) {
		this.attr({"fill":Mappt_Node_Color_Default})
		addLink_currentlySelected = null;
	    }
	    else {
		this.attr({"fill":Mappt_Node_Color_Default});
		addLink_currentlySelected.attr({"fill":Mappt_Node_Color_Default});
		var position1_id = grabFirstWhereSecond(
		    mapptEditor.paperPoints,
		    this);
		var position2_id = grabFirstWhereSecond(
		    mapptEditor.paperPoints,
		    addLink_currentlySelected);

		var position1 = mapptEditor.pointInfoManager.getPointByID(position1_id).position;
		var position2 = mapptEditor.pointInfoManager.getPointByID(position2_id).position;

		var movetoString = "M " + position1[0].toString() + " " +
		    position1[1].toString();

		var lineString = "L " + position2[0].toString() + " " +
		    position2[1].toString();

		var temp_paperPath = mapptEditor.context_paper.path(
		    movetoString + lineString)
		.insertAfter(mapptEditor.context_image);
		

		mapptEditor.paperLinks.push([
		    position1_id, 
		    position2_id, 
		    temp_paperPath]);
		addLink_currentlySelected = null;
	    }
	}
	else if (mapptEditor.state == "removeLink") {
	    if (removeLink_currentlySelected == null) {
		removeLink_currentlySelected = this;
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	    else if (removeLink_currentlySelected == this) {
		this.attr({"fill":Mappt_Node_Color_Default})
		removeLink_currentlySelected = null;
	    }
	    else {
		removeLink_currentlySelected.attr({"fill":Mappt_Node_Color_Default});
		var position1_id = grabFirstWhereSecond(
		    mapptEditor.paperPoints,
		    this);
		var position2_id = grabFirstWhereSecond(
		    mapptEditor.paperPoints,
		    removeLink_currentlySelected);

		log("Position1: "+position1_id);
		log("Position2: "+position2_id);

		var linkTuple = _.find(mapptEditor.paperLinks, function(elem) {
		    log(elem[0].toString() + " " + elem[1].toString());
		    if (position1_id == elem[0] && position2_id == elem[1] ||
			position1_id == elem[1] && position2_id == elem[0]) {
			return true;
		    }
		    return false;
		});

		//remove the link if it exists
		if (linkTuple) {
		    linkTuple[2].remove();
		    var tupleIndex = mapptEditor.paperLinks.indexOf(linkTuple);
		    mapptEditor.paperLinks.splice(tupleIndex, 1);
		}
		
		//set to null
		removeLink_currentlySelected = null;
	    }
	}
	else if (mapptEditor.state == "selectNode") {
	    if (selectNode_currentlySelected == null) {
		selectNode_currentlySelected = this;
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	    else if (selectNode_currentlySelected == this) {
		this.attr({"fill":Mappt_Node_Color_Default})
		selectNode_currentlySelected = null;
	    }
	    else {
		selectNode_currentlySelected.attr(
		    {"fill":Mappt_Node_Color_Default});
		selectNode_currentlySelected = this;
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	}
    });

    //create the data point
    var dataPoint = new PointInfoElement(
	xPosition, yPosition, type);
    
    //store the data point in our manager
    this.pointInfoManager.addPoint(dataPoint);
    
    //store both in our relation table
    this.paperPoints.push([dataPoint.id, paperPoint]);
}

MapptEditor.prototype.mode = function(state) {
    this.state = state;
    document.title = "Map-Editor - " + state;
}

MapptEditor.prototype.exportJSON = function(filename) {
    var dataPaintLinks = _.map(this.paperLinks, function(elem) {
	elem.splice(2, 1);
	return elem;
    });

    var json_data = {
	"PointInfoList" : this.pointInfoManager.getAllPoints(),
	"LinkInfoList" : dataPaintLinks,
    };

    json_data_s = JSON.stringify(json_data);
    log(json_data_s);
}

MapptEditor.prototype.setAttr = function(key, value) {
    var elementID = grabFirstWhereSecond(this.paperPoints, selectNode_currentlySelected);
    var element = this.pointInfoManager.getPointByID(elementID);

    element[key] = value;
    log(element);
}

MapptEditor.prototype.getAttr = function(key) {
    var elementID = grabFirstWhereSecond(this.paperPoints, selectNode_currentlySelected);
    var element = this.pointInfoManager.getPointByID(elementID);

    return element[key];
}

mappt = new MapptEditor("mappt-editor-main", 800, 600, "img/floor.png");
mappt.init();