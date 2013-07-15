/*
  MpptRouter is used to find the shortest path between two nodes by
  traversing nodes linked together.
  
  The structure it traverses has the format:

  {
  "PointInfoList":[{"position":[x,y], id: num}, ...],
  "LinkInfoList":[[id1,id2], ...],
  }

  Where PointInfoList consists of points with a position and an ID,
  and LinkInfoList contains relations between points.

*/

//if it is a starting point, we assign a cost of 0 and ensure that we supply a
// null connection
function createNode(point) {
    return {node: point, costSoFar: Number.MAX_VALUE, connection: null};
}

function getRoute_djikstra(source, target, routeTable, costFunc) {
    var pointList = routeTable.PointInfoList;
    var linkList = routeTable.LinkInfoList;
    
    //gets the point described by the given ID
    function getPoint(id) {
	var n = _.find(pointList, function(elem) {
	    if (elem.id == id) {
		return true;
	    }
	    return false;
	});
	return n;
    }

    var closedList = [];
    var openList = [];

    if (_.isUndefined(costFunc)) {
	costFunc = function(currentNode, endNode) {
	    startPosition = currentNode.position;
	    endPosition = endNode.position;

	    var cost = Math.sqrt(
		Math.pow(endNode.px - currentNode.px,2) + 
		    Math.pow(endNode.py - currentNode.py,2));
	    return cost;
	}
    }

    //grab the starting point and assign it to the node
    var startingPoint = _.find(pointList, function(elem) {
	return (source == elem.id);
    });

    var startingRecord = createNode(startingPoint);
    startingRecord.costSoFar = 0;
    openList.push(startingRecord);
    
    while (!_.isEmpty(openList)) {
	//get the node with the smallest cost
	var current = _.min(openList, function(elem) { 
	    return elem.costSoFar;
	});

	//log("Working with current ==> ", current.node.id);

	//end our loop if we reach our target
	//if (current.node.id == target) break;
	
	//grab all of the connections for our current node
	linkConnections = _.filter(linkList, function(elem) {
	    if (elem.first == current.node.id || elem.second == current.node.id) {
		return true;
	    }
	    return false;
	});
	//loop over each connection
	for (var i = 0; i < linkConnections.length; i++) {
	    
	    var currentConnection = linkConnections[i];
	    //get the end node id
	    var endNodeID;
	    if (current.node.id == currentConnection.first) {
		endNodeID = currentConnection.second;
	    }
	    else {
		endNodeID = currentConnection.first;
	    }

	    //log("Looking at --> ", endNodeID);

	    var endNode = _.find(pointList, function(elem) {
		return (elem.id == endNodeID);
	    });

	    //Find the lowest cost between the connections
	    var endPosition = endNode.position;
	    var startPosition = current.node.position;

	    //our cost function
	    var endNodeCost = current.costSoFar + 
		costFunc(current.node, endNode);
		

	    //if it is within the closed list, continue
	    var endNodeRecord;

	    if (_.find(closedList, function(elem) {
		return (elem.node.id == endNode.id);
	    })) { 
		//log("In Closed List");
		continue; }
	    
	    //else if it is within the open list, check if our new
	    //cost is better and continue otherwise
	    else if (!_.isUndefined(endNodeRecord = _.find(openList, function(elem) {
		return (elem.node.id == endNode.id);
	    }))) {
		if (endNodeCost >= endNodeRecord.costSoFar) {
		    //log("Cost is already low, continuing");
		    continue;
		}
		//log("New, better cost");
	    }
	    //else we need to create our record and place it
	    // within our open list
	    else {
		//log("First Time Creation");
		endNodeRecord = createNode(endNode);
	    }

	    //place our new cost and connection within our endnode
	    endNodeRecord.costSoFar = endNodeCost;
	    endNodeRecord.connection = current.node.id;
	    
	    //check again if it's in our open list, and assign it otherwise
	    //TODO: might be able to push earlier and reference
	    var chk = _.find(openList, function(elem) {
		return (elem.node.id == endNode.id);
	    });

	    if(_.isUndefined(chk)) {
		//log("Pushing to our open list");
		openList.push(endNodeRecord);
	    }
	} //END for (var i; i < linkConnections.length; i++) {

	//add our node to the closed list and remove it from the openlist
	closedList.push(current);
	//log(current.node.id);
	var openIndex = openList.indexOf(current);
	openList.splice(openIndex, 1);
    } //END while (!_.isEmpty(openList)) {

    //log("All done!");
    //log("Closed List: ", closedList);

    //grab our target node, and traverse backwards through the list to
    //our source
    pathList = [];

    var targetRecord = _.find(closedList, function(elem) {
	return (elem.node.id == target);
    });

    var sourceRecord = _.find(closedList, function(elem) {
	return (elem.node.id == source);
    });

    //traverse from our target back to our source
    var tempRecord = targetRecord;
    pathList.push(tempRecord.node.id);
    while (tempRecord != sourceRecord) {
	var tempConnection = tempRecord.connection;
	tempRecord = _.find(closedList, function(elem) {
	    return (tempConnection == elem.node.id);
	});
	pathList.push(tempRecord.node.id);
    }
    pathList.reverse();
    
    var totalCost = 0;
    _.reduce(pathList, function(a,b) {
	totalCost = totalCost + costFunc(getPoint(a), getPoint(b));
	return b;
    });
    return {data: pathList, totalCost: totalCost};
}
