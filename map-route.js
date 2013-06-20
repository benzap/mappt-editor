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
	log(partialPath, " -- ", connectionID);
	//if we reached our target, return our partial path
	if (connectionID == target) {
	    log("Reached target!")
	    return [ partialPath.concat(connectionID) ];
	}
	//if we reached a dead end, return an empty list
	else if (_.some(partialPath, function(elem) { return (elem == connectionID) })) {
	    log("Dead end");
	    return [[]];
	}

	log("nodelinks", getNodeLinks(connectionID));

	//simply perform a map reduce
	return _.map(getNodeLinks(connectionID), function(elem) {
	    return _.reduce(traversePaths(elem, partialPath.concat(connectionID)),
			    function(a,b) {
					   var val = a.concat(b);
				log(a, "+", b, "=", val);
					   return val;});
	});
    }
    
    var rawResults = traversePaths(source, []);

    log("RawResults", rawResults);

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

    log(sortedResults);
    return sortedResults;
}

x = JSON.parse('{"PointInfoList":[{"position":[529,107],"id":0,"uuid":"7fb08aa9-5a30-5103-9c01-0025dbea442d","bros":[],"type":"DOOR","room":""},{"position":[519,165],"id":1,"uuid":"8915c836-bfc6-ab41-a645-d2e46f13387e","bros":[],"type":"DOOR","room":""},{"position":[541,195],"id":2,"uuid":"d81eaefe-5eff-790f-1de2-6ff2b06f5a4b","bros":[],"type":"DOOR","room":""},{"position":[519,198],"id":3,"uuid":"65ddc318-4fe5-3068-33d7-0b98c4ea7e86","bros":[],"type":"DOOR","room":""},{"position":[519,250],"id":4,"uuid":"3b8ae6ba-c452-5a07-63ca-8af4950fbbad","bros":[],"type":"DOOR","room":""},{"position":[519,288],"id":5,"uuid":"0eaba160-4fa4-2b13-d745-caa0de5bae9b","bros":[],"type":"DOOR","room":""},{"position":[519,312],"id":6,"uuid":"fbc1a95e-760e-334f-fdf1-f28f658b8d64","bros":[],"type":"DOOR","room":""},{"position":[519,428],"id":7,"uuid":"5c755717-99e6-dc4d-7acd-781e93ed8150","bros":[],"type":"DOOR","room":""},{"position":[519,439],"id":8,"uuid":"9130fd6a-d3a4-101d-e418-cad5de8d4662","bros":[],"type":"DOOR","room":""},{"position":[542,439],"id":9,"uuid":"24be34b4-cac3-cc84-277c-1619121d1804","bros":[],"type":"DOOR","room":""},{"position":[529,526],"id":10,"uuid":"f3327484-a850-f634-4e7f-90b4d92d09b8","bros":[],"type":"DOOR","room":""},{"position":[548,526],"id":11,"uuid":"d5c5fd5f-7c5f-5bf5-309b-ceee1722cafc","bros":[],"type":"DOOR","room":""},{"position":[549,512],"id":12,"uuid":"617c28e7-a00c-d180-2a72-d019bb1516c2","bros":[],"type":"DOOR","room":""},{"position":[579,524],"id":13,"uuid":"369c6cb5-5cae-681c-4c2b-ac80d122d49a","bros":[],"type":"DOOR","room":""},{"position":[579,512],"id":14,"uuid":"53989a59-ebe5-1a46-ffb3-64145b303c31","bros":[],"type":"DOOR","room":""},{"position":[590,524],"id":15,"uuid":"852a99db-0d83-21a0-c82d-fcd66f8c24ba","bros":[],"type":"DOOR","room":""},{"position":[589,512],"id":16,"uuid":"93e8c977-c684-2ead-414d-7b21ee432cdf","bros":[],"type":"DOOR","room":""},{"position":[620,523],"id":17,"uuid":"d48edf17-5224-6767-1906-8fa87bcc7c62","bros":[],"type":"DOOR","room":""},{"position":[620,510],"id":18,"uuid":"25fab8b7-3717-d39f-1ab4-3989d35a5b27","bros":[],"type":"DOOR","room":""},{"position":[528,165],"id":19,"uuid":"7f959be6-a997-0a63-81f6-36d3aae779d5","bros":[],"type":"DOOR","room":""},{"position":[529,193],"id":20,"uuid":"d3239a53-86e1-68fe-c6a1-ca5ecbf08a13","bros":[],"type":"DOOR","room":""},{"position":[529,200],"id":21,"uuid":"c04e8cd6-a86a-9610-0132-346b900f9adb","bros":[],"type":"DOOR","room":""},{"position":[531,249],"id":22,"uuid":"5fb58ba1-7741-ee36-920d-73230875df74","bros":[],"type":"DOOR","room":""},{"position":[528,288],"id":23,"uuid":"195176dd-c294-86a0-42c0-8850a4a28a52","bros":[],"type":"DOOR","room":""},{"position":[527,312],"id":24,"uuid":"8d9b517a-0df2-a11c-b2e7-e6d89c312cb8","bros":[],"type":"DOOR","room":""},{"position":[529,428],"id":25,"uuid":"2b72d948-9866-3679-4b81-6dc768eca8f7","bros":[],"type":"DOOR","room":""},{"position":[530,439],"id":26,"uuid":"ca9f06fa-0f8b-ae55-613e-0cf1c7977d72","bros":[],"type":"DOOR","room":""},{"position":[551,107],"id":27,"uuid":"d678953b-ce07-8348-f2d0-ce0bf06e50d8","bros":[],"type":"DOOR","room":""},{"position":[551,124],"id":28,"uuid":"b6c174b1-b244-9d3e-9038-5c250365a1ab","bros":[],"type":"DOOR","room":""},{"position":[650,504],"id":29,"uuid":"633df91e-716f-8225-920d-077603ff6891","bros":[],"type":"DOOR","room":""},{"position":[639,504],"id":30,"uuid":"4fadc154-ad85-5e7c-15b1-5792e39dda87","bros":[],"type":"DOOR","room":""},{"position":[637,523],"id":31,"uuid":"40b725c2-d556-23fa-ebd6-5f85758e14fd","bros":[],"type":"DOOR","room":""},{"position":[622,427],"id":32,"uuid":"2dcdacc6-a66d-dcf5-f68c-2de519ac0fe9","bros":[],"type":"DOOR","room":""},{"position":[636,426],"id":33,"uuid":"fafff45e-c489-7e23-e850-b1833ae8ac0b","bros":[],"type":"DOOR","room":""},{"position":[651,363],"id":34,"uuid":"50ae46fc-8e23-dcae-caa6-f7376b84286b","bros":[],"type":"DOOR","room":""},{"position":[638,363],"id":35,"uuid":"45635542-63b1-0266-6677-4d60cdf546c0","bros":[],"type":"DOOR","room":""},{"position":[623,350],"id":36,"uuid":"c6f84a2a-04f5-dcd6-6c28-a5ac540c20ec","bros":[],"type":"DOOR","room":""},{"position":[637,350],"id":37,"uuid":"2ebb8f5e-74bc-ca4d-c21e-57c7c8ee1196","bros":[],"type":"DOOR","room":""},{"position":[650,285],"id":38,"uuid":"22a335f9-afb1-5bcf-b85d-69b56fb334b2","bros":[],"type":"DOOR","room":""},{"position":[638,285],"id":39,"uuid":"2d38f4a2-e053-c45c-6968-65f1a2435396","bros":[],"type":"DOOR","room":""},{"position":[623,273],"id":40,"uuid":"ebb32772-3151-c6a1-8551-b842b8835169","bros":[],"type":"DOOR","room":""},{"position":[636,272],"id":41,"uuid":"6e53088d-e86e-a089-cf6d-f8afd2132e01","bros":[],"type":"DOOR","room":""},{"position":[649,208],"id":42,"uuid":"a8921fb0-6019-5d03-ffc7-0a44f53ff64b","bros":[],"type":"DOOR","room":""},{"position":[636,209],"id":43,"uuid":"f15a70de-8349-b528-8a9f-2e120ab7b97f","bros":[],"type":"DOOR","room":""},{"position":[627,196],"id":44,"uuid":"e16d6695-5a2f-2970-0673-e537271d113d","bros":[],"type":"DOOR","room":""},{"position":[636,196],"id":45,"uuid":"a7e3880e-1e1e-763d-3922-ed7ba441fa2d","bros":[],"type":"DOOR","room":""},{"position":[650,134],"id":46,"uuid":"25174969-f5d5-9f06-fd62-90cd261c632b","bros":[],"type":"DOOR","room":""},{"position":[637,134],"id":47,"uuid":"74c94c0f-16f4-4ff9-c987-ca3ce6cc97b6","bros":[],"type":"DOOR","room":""},{"position":[638,115],"id":48,"uuid":"bc7d43c1-8717-5f52-0f4c-243c74dac26c","bros":[],"type":"DOOR","room":""},{"position":[619,115],"id":49,"uuid":"3b38349c-7f56-23f7-c82f-c1c61b651d63","bros":[],"type":"DOOR","room":""},{"position":[619,124],"id":50,"uuid":"57c6acd8-6f8e-a8da-27ba-8b309e729b90","bros":[],"type":"DOOR","room":""},{"position":[590,124],"id":51,"uuid":"b79bcf0a-1d39-f7a2-1c63-6fe421ec6d9f","bros":[],"type":"DOOR","room":""},{"position":[589,112],"id":52,"uuid":"362ca3b4-5ea1-75d4-bcf7-afc7cda490c5","bros":[],"type":"DOOR","room":""},{"position":[580,125],"id":53,"uuid":"134b0f41-7acc-f793-5557-a5de1aef1d0f","bros":[],"type":"DOOR","room":""},{"position":[578,109],"id":54,"uuid":"395fb309-32f7-5010-4ce5-34b99a4255e4","bros":[],"type":"DOOR","room":""},{"position":[588,100],"id":55,"uuid":"1b5dfaf4-d48d-ad7d-93e0-37a6cc38df84","bros":[],"type":"DOOR","room":""},{"position":[620,100],"id":56,"uuid":"255a37bc-171d-ee60-0349-8a9ae5225f25","bros":[],"type":"DOOR","room":""}],"LinkInfoList":[[17,18],[15,17],[16,15],[13,15],[14,13],[11,13],[12,11],[10,11],[26,10],[9,26],[8,26],[25,26],[7,25],[24,25],[6,24],[23,24],[5,23],[22,23],[4,22],[21,22],[20,21],[2,20],[3,21],[19,20],[1,19],[0,19],[27,0],[28,27],[54,27],[52,54],[49,52],[50,49],[48,49],[47,48],[46,47],[45,47],[44,45],[43,45],[42,43],[41,43],[40,41],[39,41],[38,39],[37,39],[36,37],[35,37],[34,35],[33,35],[32,33],[30,33],[30,29],[31,30],[17,31],[51,52],[53,54],[52,55],[49,56],[55,56],[54,55],[48,56],[46,48],[28,0],[2,21]]}');
