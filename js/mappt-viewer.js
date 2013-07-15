var MapptViewer_Image_Path = "./floorPlans_svg/";
var MapptViewer_Data_Path = "./floorPlans_data/";

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

MapptViewer = function(context_id, context_width, context_height) {

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
	"top" : "0px",
	"left" : "0px",
	"width" : this.context_width,
	"height" : this.context_height,
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
	"overflow" : "hidden"
    });
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
	"overflow" : "hidden",
    });
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

    //contains the svg for our paper
    this.context_svg = null;

    this.currentView = {
	x : 0.0,
	y : 0.0,
	w : this.context_width,
	h : this.context_height
    };

    //contains the list of maps and their respective data for each map
    // to consider traversal. From this, we can construct the routes
    // for each map, and perform search queries.
    this.mapData = null;


}

MapptViewer.prototype.init = function() {
    var mapptViewer = this;
    
    this.currentView = {
	
    };
    return this;
};

MapptViewer.prototype.setMap = function(imageName) {
    this.imageName = imageName;
    this.imageURL = MapptViewer_Image_Path + this.imageName;

    $(this.contextObj_back).empty();

    jQuery.ajax({
	type: 'GET',
	url: this.imageURL, //this is the svg file loaded as xml
	dataType: 'xml',
	cache: false,
	success: function(svgXML) {
	    this.context_svg = svgXML.getElementsByTagName('svg')[0];

	    //regex to find a number in a string
	    var r = /\d+/;
	    
	    //removing the aspect ratio preservation.
	    this.context_svg.setAttribute("preserveAspectRatio", "none");

	    //the svg width and height
	    this.context_svg_width = this.context_svg.getAttribute('width').match(r)[0];
	    this.context_svg_height = this.context_svg.getAttribute('height').match(r)[0];
	   
	    //to simulate panning and zooming of our SVG, a DIV is
	    //resized and translated behind the main paper context.
	    //change our background context to reflect the changes.
	    $(this.contextObj_back).css({
		"width" : this.context_width,
		"height" : this.context_height,
		"top" : 0,
		"left" : 0,
		"overflow" : "hidden",
	    });

	    //setup our paper in the front div container
	    this.context_paper = Raphael(this.context_id_foreground,
					 this.context_svg_width,
					 this.context_svg_height); 
	    
	    //setup our svg map in the back div container
	    $(this.contextObj_back).append(this.context_svg);
	    
	    //add a rectangle in front of the svg to allow clicks. It
	    // is added infront because we have no way to make our
	    // links and nodes to appear infront of it.
	    this.context_image = this.context_paper.rect(0,0, this.context_svg_width, this.context_svg_height);
	    this.context_image.attr({
		fill: "#ffffff", 
		'fill-opacity': 0.0,
		stroke: "#000000",
	//	"stroke-opacity" : 0.0,
	    });

	    //The view decides on the current position within our paper
	    // Allows for easier panning and zooming functionality
	    // the currentView is used by several functions order to ensure proper
	    // translations
	    this.currentView = {
		x : 0.0,
		y : 0.0,
		w : this.context_svg_width,
		h : this.context_svg_height
	    };
	    
	    this.setViewBox(
		this.currentView.x, this.currentView.y, 
		this.currentView.w, this.currentView.h
	    );

	    this.fitScreen();
	    	    

	}.bind(this),
	error: function (errObj, errString) {
	    log("Error: ", errString);
	},
	async: false
    });

    //set our data up within the viewer
    this.dataURL = MapptViewer_Data_Path + this.imageName + ".json";

    //make sure it's an async call
    $.ajaxSetup({
	async: false
    });

    if(UrlExists(this.dataURL)) {
    //we didn't find it in local storage, so we're going to check the server
	jQuery.getJSON(this.dataURL, function(data) {
	    this.routeData = data;
	    log("loading map data from remote...", this.dataURL);
	}.bind(this));
    }
    else {
	console.log(this.dataURL, " does not exist");
    }
    return this;
};

//Used to set the data set for our maps within the mappt viewer
MapptViewer.prototype.setData = function(data) {
    //produce an object that stores our map data
    this.mapData = {};
    this.mapData = _.map(data, function(elem) {
	var mapObject = {};
	mapObject.name = elem.name;
	mapObject.mapName = elem.mapURL;
	mapObject.dataName = elem.dataURL;
	mapObject.routeData = this.getJSON(MapptViewer_Data_Path + mapObject.dataName);
	return mapObject;
    }.bind(this));
    console.log(this.mapData);
    return this;
}

MapptViewer.prototype.getJSON = function(dataURL) {
    //set our data up within the viewer
    var theData;

    //make sure it's an async call
    $.ajaxSetup({
	async: false
    });

    if(UrlExists(dataURL)) {
    //we didn't find it in local storage, so we're going to check the server
	jQuery.getJSON(dataURL, function(data) {
	    theData = data;
	    log("loading map data from remote...", dataURL);
	}.bind(this));
    }
    else {
	log(dataURL, " does not exist");
    }
    return theData;
}

//Used to set the position of the paper an exact place on the screen
MapptViewer.prototype.setViewBox = function(x,y,w,h) {    
    this.context_paper.setViewBox(x, y, w, h);

    //fix for our background SVG image if it isn't the same size as
    //our raphael paper. Calculate the ratio of the raphael paper
    var viewString = "";
    viewString += String(x) + " ";
    viewString += String(y) + " ";
    viewString += String(w) + " ";
    viewString += String(h);

    //Now that we have a separate svg element, we need to also change
    //the view of our svg
    this.context_svg.setAttribute("viewBox", viewString);

    return this;
};

//used to translate the screen for panning and zooming
MapptViewer.prototype.translatePaper = function(x, y, s) {
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
};

MapptViewer.prototype.fitScreen = function() {
    
    var fixedAspect = this.correctAspect(this.context_width, this.context_height,
					 this.context_svg_width, this.context_svg_height);

    this.currentView.x = 0;
    this.currentView.y = 0;
    this.currentView.w = fixedAspect.width;
    this.currentView.h = fixedAspect.height;
    
    this.setViewBox(
	this.currentView.x,
	this.currentView.y,
	this.currentView.w,
	this.currentView.h
    );

    return this;
};

MapptViewer.prototype.getPaperScale = function() {
    var scale = this.context_width / this.currentView.w;
    return scale;
};

MapptViewer.prototype.correctAspect = function(width, height,
					       svgWidth, svgHeight) {
    //temporaries
    var newContextWidth;
    var newContextHeight;
    
    //our corrected values
    var width_aspect;
    var height_aspect;
    var svgWidth_offset;
    var svgHeight_offset;

    //if the svg is wider than the context
    if ((width / height) < 
       (svgWidth / svgHeight)) {
       newContextWidth = svgWidth / width * svgWidth;
       newContextHeight = svgHeight * newContextWidth / svgWidth;
       svgHeight_offset = (svgWidth / width * height - newContextHeight) / 2;
       svgWidth_offset = 0;
       width_aspect = newContextWidth;
       height_aspect = newContextHeight;
    }
    else {//if the svg is narrower than the context
       newContextHeight = svgHeight / height * svgHeight;
       newContextWidth = svgWidth * newContextHeight / svgHeight;
       svgWidth_offset = (svgHeight / height * width - newContextWidth) / 2;
       svgHeight_offset = 0;
       height_aspect = newContextHeight;
       width_aspect = newContextWidth;
    }

    return { width: width_aspect,
            height: height_aspect,
            width_offset: svgWidth_offset,
            height_offset: svgHeight_offset };
};

//looks through the point list and finds all of the IDs with the given
//attributes and descriptors 
MapptViewer.prototype.getPoints = function(attr, desc) {
    var pointList = _.filter(this.routeData.PointInfoList, function(elem) {
	//check if our attributes match up
	for (k in attr) {
	    if (_.isUndefined(elem[k]) ||
		elem[k] != attr[k]) {
		return false;
	    }
	}
	//check if our descriptors match up
	return true;
    });
    return pointList;
}

//Gets the route between the starting ID and the ending ID provided
MapptViewer.prototype.getMapRoute = function(startingID, endingID, routeData) {
    //first, get the route between the two destinations
    var theRoute = getRoute_djikstra(startingID, endingID, routeData);

    return theRoute;
}

//pass a structure with theRoute.data --> list of points. This will
//draw the route on the currently set map.
MapptViewer.prototype.drawRoute = function(theRoute) {
    //form our path on the map
    var firstPoint = this.getPoints({id:theRoute.data[0]})[0];
    var pathString = "M" + firstPoint.position[0] + " " + firstPoint.position[1];
    _.map(theRoute.data, function(elem) {
	//get our point positions
	var elemPos = this.getPoints({id:elem})[0].position;
	
	//figure out the offset
	pathString += "L" +  elemPos[0] + " " + elemPos[1];
	
    }.bind(this));

    this.currentPath = this.context_paper.path(pathString);
    this.currentPath.attr({
	stroke: "#D11141",
	"stroke-linecap": "butt",
	"stroke-linejoin" : "round",
    });
    return this;
}

//shortcut function to get and draw a route for the current map
MapptViewer.prototype.showRoute = function(startingID, endingID) {
    var theRoute = this.getMapRoute(startingID, endingID, this.routeData);
    return this.drawRoute(theRoute);
}

//clears the route on the map
MapptViewer.prototype.clearRoute = function() {
    this.currentPath.remove();
}

//create the search list and produce a hashtable that allows you to
//easily traverse
MapptViewer.prototype.createHashSearch = function() {
    var searchList = {};
    //
    _.map(this.mapData, function(map) { //traverse our maps
	_.map(map, function(elem) {
	    var mapData = elem.routeData;
	    for (point in mapData.PointInfoList) {
		//add a new attribute to describe what map it belongs to
		point.mapURL = map.name;
		var descriptors = point.descriptors;
		//First we go through our descriptors
		if (_.isEmpty(point.descriptors)) {
		    break;
		}
		for (theDescriptor in descriptors) {
		    theDescriptor = theDescriptor.split("=");
		    if (!_.contains(searchList, theDescriptor[0])) {
			searchList[theDescriptor[0]] = [];		    	
		    }
		    searchList.push(point);
		}
	    } //END for (point in ...
	});//END _.map(map,...
    });//END _.map(this.mapData,...
}
