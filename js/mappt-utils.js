/*
  File contains a bunch of utilities that would be useful. This file
  was created to reduce redundant functions between classes within the
  Mappt application.
 */
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

function UrlExists(url) {
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

//grabs the first value from a pair contained in a list of pairs with
//the given second value
function grabFirstWhereSecond(pairList, second) {
    var tuple = _.find(pairList, function(elem) {
	var chk = elem.second;
	if (_.isUndefined(elem.second)) {
	    chk = elem[1];
	}
	return (chk == second);
    });
    if (_.isUndefined(tuple.first)) {
	return tuple[0];
    }
    return tuple.first;
}

//grabs the second value from a pair contained in a list of pairs with
//the given first value
function grabSecondWhereFirst(pairList, first) {
    var tuple = _.find(pairList, function(elem) {
	var chk = elem.first;
	if (_.isUndefined(elem.first)) {
	    chk = elem[0];
	}
	return (elem.first == first);
    });
    if (_.isUndefined(elem.second)) {
	return tuple[1];
    }
    return tuple.second;
}

//helper function to show a prompt for clearing local data
function prompt_clearLocal(mappt) {
    var r = confirm("Are you sure you want to clear local storage? All local changes will be lost.");
    if (r == true) {
	mappt.clearLocalStorage();
    }
    else {
	log("Nothing happened.");
    }
}
