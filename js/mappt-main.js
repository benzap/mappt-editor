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
  - jquery.mousewheel
  - jquery.mobile
  
*/

Mappt = function(context_id, context_width, context_height) {
    this.context_id = context_id;

    //the width wnd height of the context
    this.context_width = context_width;
    this.context_height = context_height;

    //contains the list of maps and their respective data for each map
    // to consider traversal. From this, we can construct the routes
    // for each map, and perform search queries.
    this.mapData = null;

    //contains all of the current viewers that are active
    this.viewerList = [];
    return this;
}

Mappt.prototype.init = function() {
    var mappt = this;

    this.contextObj = $("#" + this.context_id);
    (this.contextObj.length) || log("Given ID doesn't exist");

    return this;
}

//Used to set the data set for our maps within the mappt application
Mappt.prototype.setData = function(data, bAsync) {

    if (_.isUndefined(bAsync)) {
	bAsync = false;
    }

    //make sure it's an async call
    $.ajaxSetup({
	async: bAsync
    });

    //produce an object that stores our map data
    this.mapData = [];
    this.mapData = _.map(data, function(elem) {
	var mapObject = {};
	mapObject.name = elem.name;
	mapObject.mapName = elem.mapName;
	mapObject.dataName = elem.dataName;
	mapObject.routeData = getJSON(Mappt_Data_Folder + mapObject.dataName);
	return mapObject;
    }.bind(this));

    return this;
}

//get the partial route between two areas in two different maps. This
//depends on the entrance info list having populated values to
//traverse between the two maps.

//The first version will allow traversal between two related maps
//stored within the entrance info list.
Mappt.prototype.getPartialRoute = function(firstID, firstMapName,
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
    var partialRoute = [];
    //our first path
    partialRoute.push({
	name: firstMap.name,
	mapName: firstMap.mapName,
	path: firstPartialRoute.data,
	totalCost: firstPartialRoute.totalCost,
    });
    //our second path
    partialRoute.push({
	name: secondMap.name,
	mapName: secondMap.mapName,
	path: secondPartialRoute.data,
	totalCost: secondPartialRoute.totalCost,
    });    
    return partialRoute;
}

//This function expands on the partial route and finds the best way to
//get between more than one map. It traverses through the map data to
//find more than one way to get to the destination, and chooses the
//best one.
Mappt.prototype.getFullRoute = function(firstID, firstMapName,
					secondID, secondMapName) {
    //grab all of the entrancepointlinks for each map
    var entranceLinkList = []
    _.map(this.mapData, function(elemMap) {
	_.map(elemMap.routeData.EntranceInfoList, function(elemEntrance) {
	    var entrance = {
		firstURL: elemMap.mapName,
		secondURL: elemEntrance.secondURL,
	    };//could have just extended

	    if (_.some(entranceLinkList, function(elem) {
		return elem.firstURL == elemMap.mapName &&
		    elem.secondURL == elemEntrance.secondURL;
	    })) {
	    }
	    else {
		entranceLinkList.push(entrance);
	    }
	});
    });

    //grabs all of the connections for one entrance
    var getConnections = function(entranceName) {
	var values = _.where(entranceLinkList, {firstURL: entranceName});
	return _.map(values, function(elem) {
	   return elem.secondURL; 
	});
    }

    //recursive function, passed the firstEntrance, and the partialList
    var traverseEntrances = function(source, partialList) {
	//if our current value is within the partial list, it's biting
	//itself, kill it
	if (_.contains(partialList, source)) {
	    return [[]];
	}
	//if we reached our target, return our partial list
	else if (source == secondMapName) {
	    return [ partialList.concat(secondMapName) ];
	}
	
	var result = _.map(getConnections(source), function(elemConnection) {
	    return _.reduce(traverseEntrances(elemConnection, partialList.concat(source)), function(a,b){
		return a.concat(b);
	    });
	});
	return result;
    }

    //from our relation table of entrance links, traverse and try and
    //form a path between each of the relations.
    var entrancePathList = traverseEntrances(firstMapName, []);

    //from these relations, we need to do another map reduce to find
    //every traversal that can be formed between these relations

    //function returns a list of entrances formed between the two
    //given maps which is traversing from the firstMap --> secondMap
    var getEntrances = function(firstMap, secondMap) {
	//grab the map data for just the first map
	var firstMapData = _.find(this.mapData, function(elem) {
	    return (elem.mapName == firstMap);
	});

	var entranceList = firstMapData.routeData.EntranceInfoList;
	//filter out all of the entrances that aren't a part of the
	//second map
	var entranceList = _.filter(entranceList, function(elem) {
	    return elem.secondURL == secondMap;
	});

	//apply a bit more information to our entranceList
	//include the firstMap name
	return _.map(entranceList, function(elem) {
	    return _.extend(elem, {firstURL:firstMap});
	});
    }.bind(this);

    //function looks at a given path that could be taken, and produces
    //a list of all of the legitimate routes that could be taken
    var populateTraversal = function(path) {
	var pathSegments = [];
	_.reduce(path, function(a,b) {
	    pathSegments.push(getEntrances(a,b));
	    return b;
	});

	console.log("Path Segments", pathSegments);

	var traverse = function(currentIndex, partialList) {
	    if (currentIndex == pathSegments.length) {
		console.log("the", partialList);
		return partialList;
	    }
	    //mapping over the path segments
	    return _.map(pathSegments[currentIndex], function(elem) {
		//reducing over the map partial lists that are returned
		return _.reduce(traverse(currentIndex+1, partialList.concat(elem)), function(a,b) {
		    //concatenating the lists together
		    console.log("xxxx", a, b);
		    return a.concat(b);
		});
	    });
	}
	
	var pathList = traverse(0, []);
	console.log("pathList", pathList);
	
	return pathList;
	
    }
    
    populateTraversal(entrancePathList[0]);
    
    //get the full paths made between the maps.
    var entranceFullPath = _.map(entrancePathList, function(elemPath) {
	return _.reduce(populateTraversal(elemEntrance), function(a,b) {
	    return a.concat(b);
	});
    });
}


//creates a map viewer and returns its instance. The viewer is
//appended within the mappt context.
Mappt.prototype.createViewer = function(viewer_context_id, viewer_width, viewer_height) {
    var newViewerObj = document.createElement("div");
    newViewerObj.setAttribute("id", viewer_context_id);
    $(this.contextObj).append(newViewerObj);
    console.log(viewer_context_id);
    //instantiate our viewer
    var mapptViewer = new MapptViewer(viewer_context_id, viewer_width, viewer_height)
	.init();

    return mapptViewer;
}

//provided viewer instance is removed from the DOM
Mappt.prototype.removeViewer = function(mapptViewerObject) {
    var theContext = mapptViewerObject.context_id;
    console.log(theContext);
    delete mapptViewerObject;
    console.log(mapptViewerObject);
    $("#" + theContext).remove();
    return this;
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

//shows the full route, by creating viewers and showing the routing
//information for each of them. The viewers are also stored within the
//this.viewerList to allow them tobe cleared with the
//this.clearFullRoute function.
Mappt.prototype.showFullRoute = function(routeList) {
    var numViews = routeList.length;
    var viewerWidth = $(window).width();
    var viewerHeight = $(window).height();

    console.log(routeList);

    _.map(routeList, function(elem) {
	//develop an id, remove unwanted characters
	var idString = elem.name
	    .trim()
	    .replace(/[_,.]|\s/g, "-")
	    .toLowerCase();

	console.log(idString);

	//create our viewer
	var viewerObj = this.createViewer(idString, viewerWidth, viewerHeight);
	viewerObj.setMap(elem.mapName);
	viewerObj.drawRoute(elem.path);

	this.viewerList.push(viewerObj);
    }.bind(this));
    return this;
}

Mappt.prototype.clearFullRoute = function() {
    _.map(this.viewerList, function(elem) {
	this.removeViewer(elem);
    }.bind(this))
    this.viewerList = [];
    return this;
}
