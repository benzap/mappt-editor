/*
  MpptEditor is a drop-in editor to produce layouts and points on a
map. This information can be used to provide data for path traversal
applications.

Dependencies:
- Raphael
- Raphael-utils
- JQuery
- JQuery.notify
- JQuery.storage
- underscore.js
- utils.js
- map-route.js

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
    "6" : 54,
    "7" : 55,
    "l" : 76,
    "s" : 83,
    "e" : 101,
};
//The radius of the node circles
var Mappt_Node_Radius = 4;

//Node Colors
var Mappt_Node_Color_Default = "#F5CB5B";
var Mappt_Node_Color_Selected = "#FFA52B";
var Mappt_Node_Outline_Default = "#282723"

//Temporary for linking
var addLink_currentlySelected = null;
var removeLink_currentlySelected = null;

//Temporary for holding a node for modification
var selectNode_currentlySelected = [];

//Temporary for routing
var routeNode_currentlySelected = null;

//Temporary for storing the selection box
var paper_selectionBox = null;

//Temporary for starting mouse click when zooming [x,y]
var panningStart = [];


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

PointInfoManager.prototype.clear = function() {
    this.PointInfoElementList = [];
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
MapptEditor = function (context_id, context_width, context_height) {
    //The id of the DIV element to place our MapptEditor
    this.context_id = context_id;
    //The width of our Raphael paper
    this.context_width = context_width;
    //The height of our Raphael paper
    this.context_height = context_height;

    //The SVG width and height values
    this.context_svg_width = null;
    this.context_svg_height = null;

    //our current context
    this.contextObj = $("#" + context_id);

    //check if the given ID exists
    (this.contextObj.length) || 
	log("ERROR: Provided ID does not match any element within the DOM");

    //contains the image URL
    this.imageURL = null;

    //get the offset of our context in order to draw on the paper correctly
    this.contextOffset = this.contextObj.offset();

    //contains the paper for our Raphael
    this.context_paper = null;
    //contains the image for our paper
    this.context_image = null;

    //contains the map that we are currently viewing this is
    //represented by a group of elements, but operates like a single
    //element
    this.context_map = null;

    //contains the svg for our paper
    this.context_svg = null;

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
    // moveNode
    // routeNode
    this.state = "addNode";
}

//sets the currently displayed image within the editor
MapptEditor.prototype.setMap = function(imageURL) {
    this.imageURL = imageURL;

    //TODO: clear out old image data.
    
    jQuery.ajax({
	type: 'GET',
	url: this.imageURL, //this is the svg file loaded as xml
	dataType: 'xml',
	success: function(svgXML) {
	    this.context_svg = svgXML.getElementsByTagName('svg')[0];

	    //the svg width and height
	    this.context_svg_width = this.context_svg.getAttribute('width')
	    this.context_svg_height = this.context_svg.getAttribute('height');

	    

	    this.context_paper = ScaleRaphael(this.context_id, this.context_width, this.context_height); 
	    //$('#board').css('width', '100%');
	    //paper.changeSize($('#board').width(), $('#board').width(), false, true);

	    this.context_map = this.context_paper.importSVG(this.context_svg, {
		//path: {fill: '#fff'}
	    });

	    //add a rectangle in front of the svg to allow clicks. It
	    // is added infront because we have no way to make our
	    // links and nodes to appear infront of it.
	    this.context_image = this.context_paper.rect(0,0, this.context_width, this.context_height);
	    this.context_image.attr({
		fill: "#ffffff", 
		'fill-opacity': 0.0,
		stroke: "#000000"});

	    //The view decides on the current position within our paper
	    // Allows for easier panning and zooming
	    this.currentView = {
		x : 0.0,
		y : 0.0,
		w : this.context_width,
		h : this.context_height,
	    };

	    this.context_paper.setViewBox(
		this.currentView.x, this.currentView.y, 
		this.currentView.w, this.currentView.h
	    );
	    

	}.bind(this),
	error: function (errObj, errString) {
	    log("Error: ", errString);
	},
	async: false,
    });
    return this;
}

MapptEditor.prototype.init = function() {
    //modify to allow SVG files to be loaded onto the screen
    (this.imageURL) ||
	log("ERROR: No Image was provided");

    var mapptEditor = this;

    this.contextObj.css(
	{
	    width: this.context_width, 
	    height: this.context_height,
	    position: "relative",
	});
    
    //Image click events
    this.context_image.click(function(e) {
	//only track left button clicks for now
	if (e.button != 0) return;
	if (mapptEditor.state == "addNode") {

	    var objectOffset = this.contextObj.offset();
	    var position = this.getMousePosition(e.clientX, e.clientY);

	    var xPosition = position[0];
	    var yPosition = position[1];

	    mapptEditor.createPoint(xPosition, yPosition, {type:"DOOR"});
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
    
    //Image hover events
    this.context_image.hover(function(e) {
	document.body.style.cursor = 'crosshair';
    },
			     function(e) {
				 document.body.style.cursor = 'default';
			     });
    
    //Image click and drag events
    var dragStart = function (clientX, clientY, e) {
	var objectOffset = mapptEditor.contextObj.offset();
	var xPosition = clientX -
	    objectOffset.left +
	    document.body.scrollLeft;
	    
	var yPosition = clientY -
	    objectOffset.top +
	    document.body.scrollTop;

	//middle mouse button panning
	if (e.button == 1) {
	    panningStart = [xPosition, yPosition];
	    document.body.style.cursor = "move";
	}
	//left click within selectNode selection box
	else if (mapptEditor.state == "selectNode" && e.button == 0) {
	    paper_selectionBox = mapptEditor.context_paper.rect(xPosition, yPosition, 0,0);
	    paper_selectionBox.attr({
		stroke: "#000000",
		'stroke-dasharray': "--",
		opacity: 0.5,
	    });
	    
	    //resembles the point where the box was started
	    paper_selectionBox.startX = xPosition;
	    paper_selectionBox.startY = yPosition;
	    
	    document.body.style.cursor = 'none';
	}//END else if (mapptEditor.state == "selectNode" && e.button == 0) {
    },
    dragMove = function (dx, dy, clientX, clientY, e) {
	var objectOffset = mapptEditor.contextObj.offset();

	//current position of our mouse
	var xPosition = clientX -
	    objectOffset.left +
	    document.body.scrollLeft +
	    mapptEditor.currentView.x;

	var yPosition = clientY -
	    objectOffset.top +
	    document.body.scrollTop +
	    mapptEditor.currentView.y;

	panningStart["delta"] = [dx,dy];

	if (e.button == 1) {
	    mapptEditor.context_paper.setViewBox(
		mapptEditor.currentView.x-dx,
		mapptEditor.currentView.y-dy,
		mapptEditor.currentView.w,
		mapptEditor.currentView.h
	    );
	}
	//left click within selectNode selection box
	else if (mapptEditor.state == "selectNode" && e.button == 0) {
	    //rectangle attributes0
	    var width, height, x, y;

	    //the starting positions of our mouse pointer
	    var startX = paper_selectionBox.startX;
	    var startY = paper_selectionBox.startY;

	    if (xPosition > startX) {
		width = xPosition - startX;
		x = startX;
	    } 
	    else {
		width = startX - xPosition;
		x = xPosition;
	    }
	    
	    if (yPosition > startY) {
		height = yPosition - startY;
		y = startY;
	    }
	    else {
		height = startY - yPosition;
		y = yPosition;
	    }

	    paper_selectionBox.attr({
		x: x,
		y: y,
		width: width,
		height: height,
	    });
	} //END else if (mapptEditor.state == "selectNode" && e.button == 0) {
    },
    dragUp = function (e) {
	//middle mouse button
	if (e.button == 1) {
	    mapptEditor.currentView.x = mapptEditor.currentView.x - panningStart.delta[0];
	    mapptEditor.currentView.y = mapptEditor.currentView.y - panningStart.delta[1];
	    document.body.style.cursor = 'crosshair';
	    log(mapptEditor.currentView);
	}
	//left click within selectNode selection box
	else if (mapptEditor.state == "selectNode" && e.button == 0) {
	    // restoring state
	    paper_selectionBox.remove();
	    document.body.style.cursor = 'crosshair';
	}
    };

    this.context_image.drag(dragMove, dragStart, dragUp);

    //END Events

    //upon focusing, binds global event keys to control our editor
    
    $(window).keypress(function(e) {
	if (e.keyCode == Mappt_keycodes["1"]) {
	    this.mode("addNode");
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Add Node'});
	}
	else if (e.keyCode == Mappt_keycodes["2"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Remove Node'});
	    this.mode("removeNode");
	}
	else if (e.keyCode == Mappt_keycodes["3"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Add Link'});
	    this.mode("addLink");
	}
	else if (e.keyCode == Mappt_keycodes["4"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Remove Link'});
	    this.mode("removeLink");
	}
	else if (e.keyCode == Mappt_keycodes["e"]) {
	    $("#notify-container").notify("create", {text: '<b>Exported to Console</b>'});
	    this.exportJSON(this.imageURL + ".js");
	}
	else if (e.keyCode == Mappt_keycodes["5"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Select Node'});
	    this.mode("selectNode");
	}
	else if (e.keyCode == Mappt_keycodes["6"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Move Node'});
	    this.mode("moveNode");
	}
	if (e.keyCode == Mappt_keycodes["7"]) {
	    this.mode("routeNode");
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Route Nodes'});
	}
    }.bind(this));
    return this;
}

//if an ID is provided, an ID will not be generated
MapptEditor.prototype.createPoint = function(xPosition, yPosition, attr) {
    
    //create the paper point
    var paperPoint = this.context_paper.circle(
	xPosition, yPosition, Mappt_Node_Radius)
	.attr({fill: Mappt_Node_Color_Default,
	      stroke: Mappt_Node_Outline_Default});
    
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

		var linkTuple = _.find(mapptEditor.paperLinks, function(elem) {
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
	    //If the selection list is empty
	    if (_.isEmpty(selectNode_currentlySelected)) {
		selectNode_currentlySelected = selectNode_currentlySelected.concat(this);
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	    //If the selection list has a copy of our value that was clicked, we remove it
	    else if (_.some(selectNode_currentlySelected, 
			    function(elem) { 
				return (this == elem)}.bind(this))) {

		this.attr({"fill":Mappt_Node_Color_Default});

		var selectionIndex = selectNode_currentlySelected.indexOf(this);
		selectNode_currentlySelected.splice(selectionIndex, 1);
	    }
	    // else, we concat our value into the list
	    else {
		selectNode_currentlySelected = selectNode_currentlySelected.concat(this);
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	}
	else if (mapptEditor.state == "routeNode") {
	    //first node selection
	    if (routeNode_currentlySelected == null) {
		routeNode_currentlySelected = this;
		this.attr({"fill":Mappt_Node_Color_Selected});
	    }
	    //selecting the same node makes it null
	    else if (routeNode_currentlySelected == this) {
		this.attr({"fill":Mappt_Node_Color_Default})
		routeNode_currentlySelected = null;
	    }
	    //perform our operation!
	    else {
		//set the stroke of our previous route back
		_.map(mapptEditor.paperLinks, function(elem) {
		    elem[2].attr({stroke: Mappt_Node_Outline_Default});
		});
		
		routeNode_currentlySelected.attr(
		    {"fill":Mappt_Node_Color_Default});

		routeTable = mapptEditor.exportJSON();
		//get the IDs for both of our nodes we are traversing
		var startNode_ID = grabFirstWhereSecond(mapptEditor.paperPoints,
							routeNode_currentlySelected);
		var endNode_ID = grabFirstWhereSecond(mapptEditor.paperPoints,
							this);
		
		var routeList = getRoute(startNode_ID, endNode_ID, routeTable)[0];

		log(routeList);
		var lastCase;
		_.reduce(routeList.data, function(elem1, elem2) {

		    var firstID = elem1;
		    var secondID = elem2;

		    var pathLink = _.find(mapptEditor.paperLinks, function(elem) {
			if (elem[0] == firstID && elem[1] == secondID ||
			    elem[1] == firstID && elem[0] == secondID) {
			    return true;
			}
			return false;});
		    var pathObject = pathLink[2]

		    pathObject.attr({stroke: "#FF7437"});
		    return elem2;
		});
		routeNode_currentlySelected = null;
	    } //END else {
	} //END else if (mapptEditor.state == "routeNode") {
    }); //END paperPoint.click(function(e) {
    
    paperPoint.hover(function(e) {
	if (mapptEditor.state == "addNode") {
	    document.body.style.cursor = 'crosshair';
	}
	else if (mapptEditor.state == "moveNode") {
	    document.body.style.cursor = 'move';
	}
	else {
	    document.body.style.cursor = 'pointer';
	}
    },
		     function(e) {
			 
    });
		     
    //create the data point
    var dataPoint = new PointInfoElement(
	xPosition, yPosition);
    
    _.extend(dataPoint, attr);

    //store the data point in our manager
    this.pointInfoManager.addPoint(dataPoint);

    /* Drag functions */
    //Start of the move operation
    var dragStart = function () {
	if (mapptEditor.state != "moveNode") return;
	// storing original coordinates
	this.ox = this.attr("cx");
	this.oy = this.attr("cy");
	this.attr({opacity: 0.5});
	document.body.style.cursor = 'none';

    },
    dragMove = function (dx, dy) {
	if (mapptEditor.state != "moveNode") return;
	// move will be called with dx and dy
	this.attr({cx: this.ox + dx, cy: this.oy + dy});

	// pushing changes to the data point
	mapptEditor.pointInfoManager.getPointByID(dataPoint.id).position = [this.ox+dx, this.oy+dy];
	// fixing links
	var relatedLinks = _.filter(mapptEditor.paperLinks, function(elem) {
	    if (elem[0] == dataPoint.id || elem[1] == dataPoint.id) {
		return true;
	    }
	    return false;
	});
	
	_.map(relatedLinks, function(elem) {
	    var firstNode = mapptEditor.pointInfoManager.getPointByID(elem[0]);
	    var secondNode = mapptEditor.pointInfoManager.getPointByID(elem[1]);
	    
	    var position1 = firstNode.position;
	    var position2 = secondNode.position;

	    var movetoString = "M " + position1[0].toString() + " " +
		position1[1].toString();
	    
	    var lineString = "L " + position2[0].toString() + " " +
		position2[1].toString();
	    
	    elem[2].remove();
	    elem[2] = mapptEditor.context_paper.path(
		movetoString + lineString)
		.insertAfter(mapptEditor.context_image);
	});
    },
    dragUp = function () {
	if (mapptEditor.state != "moveNode") return;
	// restoring state
	this.attr({opacity: 1});
	log(dataPoint);
    };
    paperPoint.drag(dragMove, dragStart, dragUp);

    //store both in our relation table
    this.paperPoints.push([dataPoint.id, paperPoint]);
}

MapptEditor.prototype.mode = function(state) {
    if (this.state == state) return;

    //perform any transition effects
    if (this.state == "addLink") {
	if (addLink_currentlySelected) {
	    addLink_currentlySelected.attr({"fill":Mappt_Node_Color_Default});
	}
	addLink_currentlySelected = null;
    }
    else if (this.state == "removeLink") {
	if (removeLink_currentlySelected) {
	    removeLink_currentlySelected.attr({"fill":Mappt_Node_Color_Default});
	}
	removeLink_currentlySelected = null;3
    }
    else if (this.state == "selectNode") {
	selectNode_currentlySelected = [];
    }
    else if (this.state == "routeNode") {
	routeNode_currentlySelected = null;
	//set the stroke of our previous route back
	_.map(this.paperLinks, function(elem) {
	    elem[2].attr({stroke: Mappt_Node_Outline_Default});
	});
    }
    
    this.state = state;
    document.title = "Map-Editor - " + state;
}

MapptEditor.prototype.exportJSON = function(filename) {
    var dataPaintLinks = _.map(this.paperLinks, function(elem) {
	//fixes issues with deep copying
	elemDEEP = _.map(elem, function(e) {
	    return e;
	});
	elemDEEP.splice(2,1);
	return elemDEEP;
    });

    var json_data = {
	"PointInfoList" : this.pointInfoManager.getAllPoints(),
	"LinkInfoList" : dataPaintLinks,
	"Context_Width" : this.context_width,
	"Context_Height" : this.context_height,
	"SVG_Width" : this.context_svg_width,
	"SVG_Height" : this.context_svg_height,
    };

    json_data_s = JSON.stringify(json_data);
    //json_data_s = JSON.stringify(json_data, undefined, 2);
    log(json_data_s);
    return JSON.parse(json_data_s);
}

MapptEditor.prototype.setAttr = function(key, value) {
    _.map(selectNode_currentlySelected, function(elem) {
	var elementID = grabFirstWhereSecond(this.paperPoints, elem);
	log("elementID", elementID);
	var element = this.pointInfoManager.getPointByID(elementID);
	element[key] = value;
    }.bind(this));
}

MapptEditor.prototype.getAttr = function(key) {
    var valueList = _.map(selectNode_currentlySelected, function(elem) {
	var elementID = grabFirstWhereSecond(this.paperPoints, elem);
	var element = this.pointInfoManager.getPointByID(elementID);
	return element[key];
    }.bind(this));
    return valueList;
}

MapptEditor.prototype.addLink = function(nodeID1, nodeID2) {
    var firstNode = this.pointInfoManager.getPointByID(nodeID1);
    var secondNode = this.pointInfoManager.getPointByID(nodeID2);
    
    var position1 = firstNode.position;
    var position2 = secondNode.position;
    
    var movetoString = "M " + position1[0].toString() + " " +
	position1[1].toString();
    
    var lineString = "L " + position2[0].toString() + " " +
	position2[1].toString();
    
    var pathObject = this.context_paper.path(
	movetoString + lineString)
	.insertAfter(this.context_image);

    pathObject.attr({stroke:Mappt_Node_Outline_Default});

    this.paperLinks.push([nodeID1, nodeID2, pathObject]);
}

MapptEditor.prototype.importJSON = function(routeTable) {
    //remove our nodes from paper.
    _.map(this.paperPoints, function(elem) {
	elem[1].remove();
    });
    this.paperPoints = [];
    
    //remove our links from the paper.
    _.map(this.paperLinks, function(elem) {
	elem[2].remove();
    });
    this.paperLinks = [];
    //Clear all of the point data out of the point manager
    this.pointInfoManager.clear();

    var import_points = routeTable.PointInfoList;
    var import_links = routeTable.LinkInfoList;

    _.map(import_points, function(elem) {
	this.createPoint(elem.position[0], elem.position[1], elem);
    }.bind(this));

    var maxIncrement = _.max(this.paperPoints, function(elem) {
	return elem[0];
    });
    PointInfoElement.increment = maxIncrement[0]+1;
    
    _.map(import_links, function(elem) {
	this.addLink(elem[0], elem[1]);
    }.bind(this));
}

//returns an array with the x and y position of the mouse on the
// paper. This corrects for panning and scaling. The provided x and y
// position's are absolutes.
MapptEditor.prototype.getMousePosition = function(absoluteX, absoluteY) {
    var objectOffset = this.contextObj.offset();

    //current position of our mouse
    var xPosition = absoluteX -
	objectOffset.left +
	document.body.scrollLeft +
	this.currentView.x;

    var yPosition = absoluteY -
	objectOffset.top +
	document.body.scrollTop +
	this.currentView.y;    
    return [xPosition, yPosition];
}

//for notifications
$("#notify-container").notify({
    speed: 500,
});

//mappt = new MapptEditor("mappt-editor-main", 1024, 768, "img/floor.png");
mappt = new MapptEditor("mappt-editor-main", 1024, 768)
    .setMap("floorPlans_svg/test.svg")
    .init();

