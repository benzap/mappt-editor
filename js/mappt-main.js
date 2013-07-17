/*
  The main mappt application.
  
  the main application contains the ability to search, and will
  provide facilities to spawn several viewers for the user to
  manipulate. This application will also contain the panels for
  performing search queries.

  Dependencies:
  - mappt-viewer.js
  - mappt-panel.js
  - underscore.js
  - jquery
  - jquery.ui
  - jquery.localstorage
  - jquery.mousewheel
  - jquery.mobile
  
*/

var Mappt_Main_Image_Path = "./floorPlans_svg/";
var Mappt_Main_Data_Path = "./floorPlans_data/";

Mappt = function(context_id, context_width, context_height) {
    this.context_id = context_id;

    //the width wnd height of the context
    this.context_width = context_width;
    this.context_height = context_height;

    //contains the list of maps and their respective data for each map
    // to consider traversal. From this, we can construct the routes
    // for each map, and perform search queries.
    this.mapData = null;
    return this;
}

Mappt.prototype.init = function() {
    var mappt = this;

    this.contextObj = $("#" + this.context_id);
    (this.contextObj.length) || log("Given ID doesn't exist");

    return this;
}

//Used to set the data set for our maps within the mappt application
Mappt.prototype.setData = function(data) {
    //produce an object that stores our map data
    this.mapData = [];
    this.mapData = _.map(data, function(elem) {
	var mapObject = {};
	mapObject.name = elem.name;
	mapObject.mapName = elem.mapName;
	mapObject.dataName = elem.dataName;
	mapObject.routeData = this.getJSON(Mappt_Main_Data_Path + mapObject.dataName);
	return mapObject;
    }.bind(this));

    return this;
}

//get the full route between two areas in two different maps. This
//depends on the entrance info list having populated values to
//traverse between the two maps.

//The first version will allow traversal between two related maps
//stored within the entrance info list.
Mappt.prototype.getFullRoute = function(firstID, firstMapName,
					secondID, secondMapName) {
    //get the map corresponding to our first point
    var firstMap = _.find(this.mapData, function(elem) {
	return elem.mapName == firstMapName;
    });

    //get the map corresponding to the second point
    var secondMap = _.find(this.mapData, function(elem) {
	return elem.mapName == secondMapName;
    });

    //grab our points
    var firstPoint = _.find(firstMap.routeData.PointInfoList, function(elem) {
	return elem.id == firstID;
    });
    var secondPoint = _.find(secondMap.routeData.PointInfoList, function(elem) {
	return elem.id == secondID;
    });    

    //try and see if there is a relationship between the two maps through the entrance nodes
    //we only traverse from the first node to the second node
    var firstEntranceList = firstMap.routeData.EntranceInfoList;
    var entranceRelations = _.filter(firstEntranceList, function(elem) {
	return elem.secondURL == secondMapName;
    });

    //from our first to our first entrances, form least costs and grab the one with the least cost
    var partialRouteList = _.map(entranceRelations, function(elem) {
	var partial = getRoute_djikstra(firstID, elem.first, firstMap.routeData);
	//fill our partial route with more useful information
	//the ID to the entrance of the building we want to enter
	partial.first = elem.first;
	//the ID to the node on the other side of the entrance within the other map
	partial.second = elem.second;
	return partial;
    }.bind(this));

    //get our minimum least cost
    var firstPartialRoute = _.min(partialRouteList, function(elem) {
	return (elem.totalCost);
    });

    //now that we have a partial route, we can take it's second value
    //and form the rest of the way to our destination
    var secondPartialRoute = getRoute_djikstra(firstPartialRoute.second, secondID, secondMap.routeData);

    //form a better representation for our data
    var fullRoute = [];
    //our first path
    fullRoute.push({
	name: firstMap.name,
	mapName: firstMap.mapName,
	path: firstPartialRoute.data,
    });
    //our second path
    fullRoute.push({
	name: secondMap.name,
	mapName: secondMap.mapName,
	path: secondPartialRoute.data,
    });    
    return fullRoute;
}

Mappt.prototype.getJSON = function(dataURL) {
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

Mappt.prototype.createViewer = function(viewer_context_id, viewer_width, viewer_height) {
    var newViewerObj = document.createElement("div");
    newViewerObj.setAttribute("id", viewer_context_id);
    $(this.contextObj).append(newViewerObj);
    console.log(viewer_context_id);
    //instantiate our viewer
    var mapptViewer = new MapptViewer(viewer_context_id, viewer_width, viewer_height);
    return mapptViewer;
}

//create the search list and produce a hashtable that allows you to
//easily traverse. The search is produced from the descriptors
//describing the nodes.
Mappt.prototype.createSearchList = function() {
    var searchList = {};
    //grab the map data for each map
    _.map(this.mapData, function(elemMap) {
	//traverse through the map's route data points
	_.map(elemMap.dataRoute.PointInfoList, function(elemPoint) {
	    //grab all of the descriptors and figure out what makes this particular point unique
	});//END _.map(elemMap.dataRoute.PointInfoList, ...
    });//END _.map(this.mapData, ...
    
}