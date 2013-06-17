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

var fs = require("fs");

//if it is a starting point, we assign a cost of 0 and ensure that we supply a
// null connection
function createNode(point, isStart) {
    if (isStart) {
	return {node: point, costSoFar: [0], connection: [null]};
    }
    return {node: point, costSoFar: [], connection: []};
}

function getRoute(source, target, srcFile) {
    fs.readFile(srcFile, 'utf8', function (err, data) {
	if (err) throw err;
	var routeTable = JSON.parse(data);
	
	var pointList = routeTable.PointInfoList;
	console.log(pointList);

	var linkList = routeTable.LinkInfoList;
	console.log(linkList);

	closedList = [];
	openList = [];

	//grab the starting point and assign it to the node
	var startingPoint = _.find(routeTable, function(elem) {
	    return (source == elem.id);
	});

	openList.push(createNode(startingPoint, true));
	
	while (!_.isEmpty(openList)) {
	    //get the node with the smallest cost
	    var currentNode = _.min(openList, function(elem) { return elem.cost
	}
    });
}

getRoute(1,2, "testRoute.json");