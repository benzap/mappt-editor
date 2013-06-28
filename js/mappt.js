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
//*****************************************
//** MapptEditor Configuration Variables **
//*****************************************

var Mappt_keycodes = {
    "1" : 49,
    "2" : 50,
    "3" : 51,
    "4" : 52,
    "5" : 53,
    "6" : 54,
    "7" : 55,
    "l" : 76,
    "s" : 115,
    "e" : 101,
    "f" : 102,
    "return" : 13,
    "=" : 61,
    "-" : 45,
    "i" : 105,
    "j" : 106,
    "k" : 107,
    "l" : 108,
    "u" : 117,
    "o" : 111,
};

//The radius of the node circles
var Mappt_Node_Radius = 2;

var Mappt_states = [
    "addNode",
    "removeNode",
    "addLink",
    "removeLink",
    "selectNode",
    "moveNode",
    "routeNode",
]

var Mappt_node_types = [
    "DOOR", //doors and doorways
    "HALL", //hallways in buildings
    "WALK", //misc. walking areas
    "AREA", //rooms
    "ELEVATION", //elevators and stairs
    "ENTRANCE", //entrance into new map
    "START", //typical starting areas
];

//Directory partial paths
//partial path for the maps
var Mappt_Layout_Folder = "./floorPlans_svg/";
var Mappt_Data_Folder = "./floorPlans_data/";

//Node Colors
var Mappt_Node_Color_Default = "#F5CB5B";
var Mappt_Node_Color_Selected = "#DD830B";
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

//Temporary for starting mouse click when panning [x,y]
var panningStart = [];

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

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
//Not all information for each node type will need to be filled
//Right off the bat
//Depends on what the node type is
PointInfoElement = function(xPosition, yPosition, type) {
    this.position = [xPosition, yPosition];
    this.id = PointInfoElement.increment;
    PointInfoElement.increment += 1; //local id
    this.uuid = guid(); //global id
    this.type = type;
    this.tags = []; //Department, Room, Stairs, ... etc
    this.descriptors = ""; //
    this.mapUp_url = "";
    this.mapUp_links = [];
    this.mapUp_elevation = "";
    this.mapDown_url = "";
    this.mapDown_links = [];
    this.mapDown_elevation = "";
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

    //The id of the DIV element for our top-level container
    this.context_id = context_id;
    //The width of our Raphael paper
    this.context_width = context_width;
    //The height of our Raphael paper
    this.context_height = context_height;

    this.context_id_background = this.context_id + "-back";
    this.context_id_foreground = this.context_id + "-front";

    //The SVG width and height values
    this.context_svg_width = null;
    this.context_svg_height = null;

    //our current context
    this.contextObj = $("#" + context_id);
    $(this.contextObj).css({
	"position" : "relative",
	"overflow" : "hidden",
    });

    //check if the given ID exists
    (this.contextObj.length) || 
	log("ERROR: Provided ID does not match any element within the DOM");

    //create our background div and foreground divs
    //the background div will hold our SVG image
    this.contextObj_back = document.createElement("div");
    this.contextObj_back.setAttribute("id", this.context_id_background);
    $(this.contextObj_back).css({
	"position" : "absolute",
	"z-index" : 0,
	"width" : "100%",
	"height" : "100%",
	"overflow" : "hidden",
    })
    $(this.contextObj).append(this.contextObj_back);
    
    //create our foreground div
    //the foreground div will hold our raphael paper
    this.contextObj_front = document.createElement("div");
    this.contextObj_front.setAttribute("id", this.context_id_foreground);
    $(this.contextObj_front).css({
	"position" : "absolute",
	"z-index" : 1,
	"width" : "100%",
	"height" : "100%",
    })
    $(this.contextObj).append(this.contextObj_front);


    //contains the image URL full path
    this.imageURL = null;
    //contains the name of the image
    this.imageName = null;


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

    //Callback handlers
    //our callback handler for selecting nodes
    this.callback_click_select = $.Callbacks();

    //Used to track when the mouse is within the
    //editor area or not
    this.bContextHovered = false;

}

//sets the currently displayed image within the editor
MapptEditor.prototype.setMap = function(imageName) {
    var mapptEditor = this;
    this.imageURL = Mappt_Layout_Folder + imageName;
    this.imageName = imageName;

    //include a template for what our data url should look like
    this.dataName = this.imageName + ".json";
    this.dataURL = Mappt_Data_Folder + this.dataName;

    if (!UrlExists(this.imageURL)) {
	log("MapptEditor.setMap --> Given image URL does not exist: ", this.imageURL);
	return -1;
    }

    //clear our current image from the background
    $(this.contextObj_back).empty();
    this.clearData();

    jQuery.ajax({
	type: 'GET',
	url: this.imageURL, //this is the svg file loaded as xml
	dataType: 'xml',
	success: function(svgXML) {
	    this.context_svg = svgXML.getElementsByTagName('svg')[0];

	    //regex to find a number in a string
	    var r = /\d+/;
	    
	    //the svg width and height
	    this.context_svg.setAttribute('width', this.context_width);
	    this.context_svg.setAttribute('height', this.context_height);
	    this.context_svg_width = this.context_svg.getAttribute('width').match(r)[0];
	    this.context_svg_height = this.context_svg.getAttribute('height').match(r)[0];
	   
	    //setup our paper in the front div container
	    this.context_paper = ScaleRaphael(this.context_id_foreground,
					      this.context_width,
					      this.context_height); 

	    //setup our svg map in the back div container
	    $(this.contextObj_back).append(this.context_svg);


	    //add a rectangle in front of the svg to allow clicks. It
	    // is added infront because we have no way to make our
	    // links and nodes to appear infront of it.
	    this.context_image = this.context_paper.rect(0,0, this.context_width, this.context_height);
	    this.context_image.attr({
		fill: "#ffffff", 
		'fill-opacity': 0.0,
		stroke: "#000000"});

	    //The view decides on the current position within our paper
	    // Allows for easier panning and zooming functionality
	    // the currentView is used by several functions order to ensure proper
	    // translations
	    this.currentView = {
		x : 0.0,
		y : 0.0,
		w : this.context_width,
		h : this.context_height,
	    };

	    this.setViewBox(
		this.currentView.x, this.currentView.y, 
		this.currentView.w, this.currentView.h
	    );
	    

	}.bind(this),
	error: function (errObj, errString) {
	    log("Error: ", errString);
	},
	async: false,
    });

    //Image click events
    this.context_image.click(function(e) {
	//only track left button clicks for now
	if (e.button != 0) return;
	if (mapptEditor.state == "addNode") {
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

    //Image scroll wheel events (zoom)
    $(this.context_image.node).bind('mousewheel', function(event, delta) {
        var scaleDelta = delta > 0 ? 1.1 : 0.9;
	var objectOffset = mapptEditor.contextObj.offset();
	var oldScale = mapptEditor.getPaperScale();
	var position = mapptEditor.getMousePosition(event.clientX, event.clientY);

	//scaling should take into account the current window position and scale
	//get the current position and translate our window to make scaling look more
	// natural
	var centerX = mapptEditor.currentView.w / 2;
	var centerY = mapptEditor.currentView.h / 2;

	//get the position of the mouse within the context holding the paper
	var contextPositionX = event.clientX -
	    objectOffset.left +
	    document.body.scrollLeft;
	
	var contextPositionY = event.clientY -
	    objectOffset.top +
	    document.body.scrollTop;

	var contextCenterX = this.context_width / 2;
	var contextCenterY = this.context_height / 2;

	var positionXdelta = (contextPositionX - contextCenterX);
	var positionYdelta = (contextPositionY - contextCenterY);

	mapptEditor.translatePaper(0,//positionXdelta,
				   0,//positionYdelta,
				   scaleDelta);
    });

    //Image click and drag events
    var dragStart = function (clientX, clientY, e) {
	var position = mapptEditor.getMousePosition(clientX, clientY);
	var xPosition = position[0];
	var yPosition = position[1];
	var scale = mapptEditor.getPaperScale();
	
	//middle mouse button panning
	if (e.button == 1) {
	    panningStart = [xPosition, yPosition];
	    panningStart["delta"] = [0,0];
	    document.body.style.cursor = "move";
	}
	//left click within selectNode selection box
	else if (mapptEditor.state == "selectNode" && e.button == 0) {
	    paper_selectionBox = mapptEditor.context_paper.rect(xPosition, yPosition, 0,0);
	    paper_selectionBox.attr({
		stroke: "#000000",
		'stroke-width' : 5 / scale,
		'stroke-dasharray': ".",
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


	var position = mapptEditor.getMousePosition(clientX, clientY);
	var xPosition = position[0];
	var yPosition = position[1];
	
	//need to correct our change for scaling
	var scale = mapptEditor.getPaperScale();
	//scaled version
	dx = dx / scale;
	dy = dy / scale;

	panningStart["delta"] = [dx,dy];

	if (e.button == 1) {
	    mapptEditor.setViewBox(
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
	    //we assign the new delta to our currentView
	    mapptEditor.currentView.x = mapptEditor.currentView.x - panningStart.delta[0];
	    mapptEditor.currentView.y = mapptEditor.currentView.y - panningStart.delta[1];
	    document.body.style.cursor = 'crosshair';
	}
	//left click within selectNode selection box
	else if (mapptEditor.state == "selectNode" && e.button == 0) {
	    //determining what elements were selected
	    var width = paper_selectionBox.attr("width");
	    var height = paper_selectionBox.attr("height");
	    var startX = paper_selectionBox.attr("x");
	    var startY = paper_selectionBox.attr("y");
	    var endX = startX + width;
	    var endY = startY + height;
	    

	    var collidedPoints = _.filter(mapptEditor.pointInfoManager.getAllPoints(), function(elem){
		var xPosition = elem.position[0];
		var yPosition = elem.position[1];

		// if it's within the X bounds of our selection bos
		if (xPosition < startX || xPosition > endX) {
		    return false;
		}
		// if it's within the Y bounds of our selection box
		if (yPosition < startY || yPosition > endY) {
		    return false;
		}
		//it has collided.
		return true;
	    });

	    selectNode_currentlySelected = _.map(collidedPoints, function(elem) {
		var paperNode = grabSecondWhereFirst(mapptEditor.paperPoints, elem.id);
		return paperNode;
	    });



	    // restoring state
	    paper_selectionBox.remove();
	    document.body.style.cursor = 'crosshair';

	    //removing highlighting on appropriate nodes,
	    _.map(mapptEditor.paperPoints, function(elem) {
		elem[1].attr({
		    "fill" : Mappt_Node_Color_Default,
		});
	    });
	    
	    //add highlighting to appropriate nodes
	    _.map(selectNode_currentlySelected, function(elem) {
		elem.attr({
		    "fill" : Mappt_Node_Color_Selected,
		});
	    });
	}
    };

    this.context_image.drag(dragMove, dragStart, dragUp);    

    //try importing data if it exists
    this.loadMapData(this.dataName);

    return this;
}

MapptEditor.prototype.init = function() {
    var mapptEditor = this;

    //setup our local storage if it doesn't exist
    if (_.isNull(this.getLocalStorage())) {
	log("Initializing Local Storage...");
	this.initLocalStorage();
    }

    //turn off everything in case we have already initialized before
    $("*").off(".mappt");

    this.contextObj.css(
	{
	    width: this.context_width, 
	    height: this.context_height,
	    position: "relative",
	});
    
    //Image hover events
    $(this.contextObj).hover(function(e) {
	document.body.style.cursor = 'crosshair';
	document.body.style.overflow="hidden";
	mapptEditor.bContextHovered = true;
    },
			     function(e) {
				 document.body.style.cursor = 'default';
				 document.body.style.overflow="";
				 mapptEditor.bContextHovered = false;
			     });

    
    $(window).on("keypress .mappt", function(e) {
	//if the mouse isn't within the context window, return
	if (!(this.bContextHovered)) {
	    return;
	}

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
	    var jsonData = this.exportJSON();
	    log(jsonData);
	}
	else if (e.keyCode == Mappt_keycodes["5"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Select Node'});
	    this.mode("selectNode");
	}
	else if (e.keyCode == Mappt_keycodes["6"]) {
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Move Node'});
	    this.mode("moveNode");
	}
	else if (e.keyCode == Mappt_keycodes["7"]) {
	    this.mode("routeNode");
	    $("#notify-container").notify("create", {text: '<b>Mode: </b>Route Nodes'});
	}
	else if (e.keyCode == Mappt_keycodes["f"]) {
	    this.fitScreen();
	    $("#notify-container").notify("create", {text: '<b>Fit Screen</b>'});
	}
	else if (e.keyCode == Mappt_keycodes["s"]) {
	    this.saveMapData();
	    $("#notify-container").notify("create", {text: '<b>Saved to Local...</b>'});
	}
	else if (e.keyCode == Mappt_keycodes["="] ||
		 e.keyCode == Mappt_keycodes["u"]) {
	    this.translatePaper(0,0,1.1);
	}
	else if (e.keyCode == Mappt_keycodes["-"] ||
		 e.keyCode == Mappt_keycodes["o"]) {
	    this.translatePaper(0,0,0.9);
	}
	else if (e.keyCode == Mappt_keycodes["i"]) {
	    this.translatePaper(0,100 / this.getPaperScale(), 1);
	}
	else if (e.keyCode == Mappt_keycodes["k"]) {
	    this.translatePaper(0,-100 / this.getPaperScale(), 1);
	}
	else if (e.keyCode == Mappt_keycodes["j"]) {
	    this.translatePaper(100 / this.getPaperScale(), 0, 1);
	}
	else if (e.keyCode == Mappt_keycodes["l"]) {
	    this.translatePaper(-100 / this.getPaperScale(), 0, 1);
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
	//clicking on nodes, provides us with the ability to edit
	else if (mapptEditor.state == "selectNode") {
	    mapptEditor.callback_click_select.fire(this);
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

		routeTable = JSON.parse(mapptEditor.exportJSON());
		//get the IDs for both of our nodes we are traversing
		var startNode_ID = grabFirstWhereSecond(mapptEditor.paperPoints,
							routeNode_currentlySelected);
		var endNode_ID = grabFirstWhereSecond(mapptEditor.paperPoints,
							this);
		
		var routeList = getRoute(startNode_ID, endNode_ID, routeTable)[0];

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
			 document.body.style.cursor = 'crosshair';
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
	//fix the scaling
	var scale = mapptEditor.getPaperScale();
	dx = dx / scale;
	dy = dy / scale;
	

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
	document.body.style.cursor = 'move';
    };
    paperPoint.drag(dragMove, dragStart, dragUp);

    //store both in our relation table
    this.paperPoints.push([dataPoint.id, paperPoint]);
}

MapptEditor.prototype.mode = function(state) {
    if (this.state == state) return;

    //perform any transition effects for the previous state
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
	_.map(selectNode_currentlySelected, function(elem) {
	    elem.attr({"fill":Mappt_Node_Color_Default});
	});
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
	"SVG_Filename" : this.imageName,
    };

    json_data_s = JSON.stringify(json_data);
    return json_data_s;
}

MapptEditor.prototype.displayJSON = function() {
    var json_data = this.exportJSON();
    log(json_data);
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

//imports the given routetable onto the screen to
//overlay the current image
MapptEditor.prototype.importJSON = function(routeTable) {
    this.clearData();
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

//Clears all of the points and links on the screen
//deletes all backend data as well
MapptEditor.prototype.clearData = function() {
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
}

//returns an array with the x and y position of the mouse on the
// paper. This corrects for panning and scaling. The provided x and y
// position's are absolutes.
MapptEditor.prototype.getMousePosition = function(absoluteX, absoluteY) {
    var objectOffset = this.contextObj.offset();

    //fix scaling
    var scale = this.getPaperScale();

    //current position of our mouse
    var xPosition = (absoluteX -
	objectOffset.left +
	document.body.scrollLeft) / scale +
	this.currentView.x;

    var yPosition = (absoluteY -
	objectOffset.top +
	document.body.scrollTop) / scale +
	this.currentView.y;

    return [xPosition, yPosition];
}

//used to translate the screen for panning and zooming
MapptEditor.prototype.translatePaper = function(x, y, s) {
    this.currentView.x = this.currentView.x - x;
    this.currentView.y = this.currentView.y - y;
    this.currentView.w = this.currentView.w / s;
    this.currentView.h = this.currentView.h / s;
    this.setViewBox(
	this.currentView.x,
	this.currentView.y,
	this.currentView.w,
	this.currentView.h
    );

    return this;
}

//Used to set the position of the paper an exact place on the screen
MapptEditor.prototype.setViewBox = function(x,y,w,h) {    
    this.context_paper.setViewBox(x, y, w, h);

    //fix for our background SVG image if it isn't the same size as
    //our raphael paper. Calculate the ratio of the raphael paper
    var viewString = "";
    viewString += String(x * this.context_svg_width / this.context_width) + " ";
    viewString += String(y * this.context_svg_height / this.context_height) + " ";
    viewString += String(w * this.context_svg_width / this.context_width) + " ";
    viewString += String(h * this.context_svg_height / this.context_height);

    //Now that we have a separate svg element, we need to also change
    //the view of our svg
    this.context_svg.setAttribute("viewBox", viewString);

    return this;
}

//used to fit the current image to the full size of the paper
MapptEditor.prototype.fitScreen = function() {
    this.currentView.x = 0;
    this.currentView.y = 0;
    this.currentView.w = this.context_width;
    this.currentView.h = this.context_height;
    
    this.setViewBox(
	this.currentView.x,
	this.currentView.y,
	this.currentView.w,
	this.currentView.h
    );

    return this;
}

MapptEditor.prototype.getPaperScale = function() {
    var scale = this.context_width / this.currentView.w;
    return scale;
}

//Used to reinitialize localstorage, and produce the base tree from
//which to work from
//The provided ID is the name of the mappt structure we are working on
MapptEditor.prototype.initLocalStorage = function(ID) {
    //Unique descriptor
    var ID = ID;
    if(_.isUndefined(ID)) ID = "CC";
    var struct = {};
    struct["Mappt-Listing"] = {};
    $.localStorage("Mappt-Structure-" + ID, JSON.stringify(struct));
    return struct;
}

MapptEditor.prototype.setLocalStorage = function(struct, ID) {
    var ID = ID;
    if(_.isUndefined(ID)) ID = "CC";
    $.localStorage("Mappt-Structure-" + ID, JSON.stringify(struct));
}

//grab the local storage structure that resembles our entire map
MapptEditor.prototype.getLocalStorage = function(ID) {
    var ID = ID;
    if(_.isUndefined(ID)) ID = "CC";
    return JSON.parse($.localStorage("Mappt-Structure-" + ID));
}

MapptEditor.prototype.clearLocalStorage = function(ID) {
    var ID = ID;
    if(_.isUndefined(ID)) ID = "CC";
    return $.localStorage("Mappt-Structure-" + ID, null);
}

//Used to load a map's data from either local storage. If the file doesn't
//exist in local storage, the server is checked for the file
//the data should follow the convention of being the imageName + .json
// ex. Dorion_1.svg.json
MapptEditor.prototype.loadMapData = function() {

    var localStorage = this.getLocalStorage();
    for (filename in localStorage["Mappt-Listing"]) {
	//found the file in our local storage, returning with it
	if (filename == this.dataName) {
	    log("loading map data from local...", this.dataName);
	    this.importJSON(localStorage["Mappt-Listing"][this.dataName]);
	    return;
	}
    }
    
    if(UrlExists(this.dataURL)) {
    //we didn't find it in local storage, so we're going to check the server
	jQuery.getJSON(this.dataURL, function(data) {
	    this.importJSON(data);
	    log("loading map data from remote...", this.dataURL);
	}.bind(this));
    }

}

//Saves the current map layout within local storage
MapptEditor.prototype.saveMapData = function() {
    var data = JSON.parse(this.exportJSON());
    log("Saving map data locally...", this.dataName);
    var structData = this.getLocalStorage();
    //replace within our localstorage, the map data for our current open map
    structData['Mappt-Listing'][this.dataName] = data;
    //replace our localstorage with the new map data
    this.setLocalStorage(structData);
}
