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

  getRoute returns a list of structures consisting of the path of
  traversal, and the cost to perform that path of traversal.

  The list is ordered by least cost

*/

function getRoute(source, target, routeTable, costFunc) {
    var pointList = routeTable.PointInfoList;
    var linkList = routeTable.LinkInfoList;

    function getNodeLinks(id) {
	var l = _.filter(linkList, function(elem) {
	    if(elem[0] == id || elem[1] == id) {
		return true;
	    }
	    return false;
	});
	var nodeLinks = _.map(l, function(elem) {
	    if (elem[0] == id) {
		return elem[1];
	    }
	    else {
		return elem[0];
	    }
	});
	return nodeLinks;
    }

    function getNode(id) {
	var n = _.find(pointList, function(elem) {
	    if (elem.id == id) {
		return true;
	    }
	    return false;
	});
	return n;
    }

    if (_.isUndefined(costFunc)) {
	costFunc = function(currentNode, endNode) {
	    startPosition = currentNode.position;
	    endPosition = endNode.position;

	    var cost = Math.sqrt(
		Math.pow(endPosition[0] - startPosition[0],2) + 
		    Math.pow(endPosition[1] - startPosition[1],2));
	    return cost;
	}
    }

    function traversePaths(connectionID,  //the place i'm going to traverse to
			   partialPath) {//the current partial path of traversal
	//log(partialPath, " -- ", connectionID);
	//if we reached our target, return our partial path
	if (connectionID == target) {
	    //log("Reached target!")
	    return [ partialPath.concat(connectionID) ];
	}
	//if we reached a dead end, return an empty list
	else if (_.some(partialPath, function(elem) { return (elem == connectionID) })) {
	    //log("Dead end");
	    return [[]];
	}

	//simply perform a map reduce
	return _.map(getNodeLinks(connectionID), function(elem) {
	    return _.reduce(traversePaths(elem, partialPath.concat(connectionID)),
			    function(a,b) {return a.concat(b);});
	});
    }
    
    var rawResults = traversePaths(source, []);

    //take our raw results, and apply our weights using our given
    //costFunction between nodes. produces a list of 
    //[{data : our data, totalCode: the total cost}, ...]
    var results = _.map(rawResults, function(elem) {
	var dataSet = elem;
	var totalCost = 0;
	_.reduce(elem, function(a,b) {
	    totalCost = totalCost + costFunc(getNode(a), getNode(b));
	    return b;
	});
	return {data: dataSet, totalCost: totalCost};
    });

    var sortedResults = _.sortBy(results, function(elem) {
	return elem.totalCost;
    });

    log(sortedResults[0]);
    return sortedResults;
}
