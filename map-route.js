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

//stores the results of full source to target paths taken
var _traverse_results = [];

//stores a hash of already traversed
var _traverse_hash = [];

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

    var resultPaths = [];
    function traversePaths(startID, //the place i'm starting at
			   endID,  //the place i'm going to traverse to
			   partialPaths) {//the current partial path of traversal
	//we're going from start --> end
	// need to look through the partial list and find
	// the path that has that given start
	partialPaths = _.map(partialPaths, function(elem) {
	    _.some(elem, function(e) { return (e == source || e == target)
	    elem.push(endID);
	});
	
	
	
    }

    var results = _.map(getNodeLinks(source), function(elem) {
	traversePaths(source, elem, [[source]]);
    }
    return results;
}
