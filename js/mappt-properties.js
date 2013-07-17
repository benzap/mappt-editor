/* MapptEditor properties extends the functionality of the mappt
 * editor by allowing you to change the attributes of currently
 * selected nodes.

 Dependencies:
 
 - MapptEditor
 - Underscore.js
 - jQuery


 */

//css .class properties to style the properties table
Mappt_p_table_class = "mappt-properties-table";
Mappt_p_row_class = "mappt-properties-row";
Mappt_p_column_name_class = "mappt-properties-column-name";
Mappt_p_column_value_class = "mappt-properties-column-value";
Mappt_p_input_class = "mappt-properties-input";

//function takes in a string, and converts it into
// a meaningul javascript object
// "10.0,12.0" --> Array([10.0, 12.0])
// "10.0" --> 10.0
// "hello,world" --> ["hello", "world"]
function sanitizeInput(theString) {
    //regex to check if the string is an integer
    r_hasInteger = /^-?\d+$/;

    //regex to check if the string is a float (no exp)
    r_hasFloat = /^-?\d*\.?\d*$/;

    //regex to check if the string has any commas
    r_hasComma = /,/;
    
    //regex to check if a string has equals signs
    r_hasEquals = /=/;
    
    var theArray;
    //check if our string has equals signs
    //make it into a hashtable / object if it does
    if (r_hasEquals.test(theString)) {
	theValues = theString.split(",");
	theArray = {};
	for (var i = 0; i < theValues.length; i++) {
	    var val = theValues[i].split("=");
	    theArray[val[0]] = val[1];
	}
	return theArray;
    }
    else if (r_hasComma.test(theString)) {
	theArray = theString.split(",");	
    }
    else if (!theString.length) {
	return "";
    }
    else {
	theArray = [ theString ];
    }
    for (var i = 0; i < theArray.length; i++) {
	//remove any whitespace (s.strip())
	theArray[i] = theArray[i].replace(/\s+/g,'');

	if (r_hasInteger.test(theArray[i])) {
	    theArray[i] = parseInt(theArray[i]);
	}
	else if (r_hasFloat.test(theArray[i])) {
	    theArray[i] = parseFloat(theArray[i]);
	}
    }
    if (theArray.length == 1) {
	return theArray[0];
    }
    else return theArray;
}

MapptEditor_Properties = function(parent, context_id) {
    //the MapptEditor parent we are referring to
    this.parent = parent;

    //The context id for our toolbar
    this.context_id = context_id;

    //Our toolbar context object
    this.contextObj = $("#" + this.context_id);

    (this.contextObj.length) || 
	log("ERROR: Provided ID for the mappt properties does not exist");

    //Includes all of the currently active properties
    this.activeProperties = [];
    this.currentlySelected_buffer = [];
}

MapptEditor_Properties.prototype.init = function() {

    $(window).keypress(function(e) {
	if (e.keyCode == Mappt_keycodes["return"]) {
	    this.updateActiveProperties();
	    $("#notify-container").notify("create", {text: '<b>Updated Node</b>'});
	    $("." + Mappt_p_input_class).blur();
	}
    }.bind(this));

    $(this.contextObj).mouseleave(function(e) {
	$("." + Mappt_p_input_class).blur();
    }.bind(this));

    //bind our function to the Callback that fires in our
    // selectNode.click event
    this.parent.callback_click_select.add(this.callback_selectnode_click.bind(this));

    return this;
}

//callback that is called whenever a node is clicked while in selectNode mode
MapptEditor_Properties.prototype.callback_selectnode_click = function(paperPoint) {
    //get all of the point elements resembling the paper.circle's

    var elementID = grabFirstWhereSecond(this.parent.paperPoints, paperPoint);
    var pointElement = this.parent.pointInfoManager.getPointByID(elementID);
    
    //clear our previous batch of properties shown
    this.clearProperties();

    //show our single point properties on the screen
    this.appendProperties(pointElement);

}

//after the active properties have been changed, update our active
//properties stored and return them. These new properties can then be
//applied to our PointInfoElement objects using an _.extend()
MapptEditor_Properties.prototype.updateActiveProperties = function() {
    //grab the property table
    var propertyTable = $("." + Mappt_p_table_class).find("tr");
    for (var i = 0; i < propertyTable.length; i++) {
	var property = propertyTable[i];
	//grab the key from the first column in the row
	var key = $(property).find("." + Mappt_p_column_name_class).text();
	//grab the value from the input in the second column of the row
	var value = $(property).find("." + Mappt_p_column_value_class).find("input").val();
	
	this.activeProperties[key] = sanitizeInput(value);
    }
    return this.activeProperties;
}

//goes through the given object, and constructs a form to display onto the screen
MapptEditor_Properties.prototype.appendProperties = function(obj) {
    var tableObj = this.appendNewTable();
    for (key in obj) {
	var rowObj = this.appendNewRow(tableObj);
	this.appendColumn(rowObj, key, obj[key]);
    }
    
    //throw all of the appended properties into our active properties
    this.activeProperties = obj;
}

//creates a new table at the top of the context's DOM and stores this
//table as a table obj. returns the table object.
MapptEditor_Properties.prototype.appendNewTable = function() {
    var tableObj = document.createElement("table");
    //our identifier for each table
    $(tableObj).addClass(Mappt_p_table_class);
    $(this.contextObj).append(tableObj);

    return tableObj;
}

//clears the context of all of the tables
MapptEditor_Properties.prototype.clearProperties = function() {
    $(this.contextObj).empty();
}

//appends a new row to the currently active table and returns the DOM
//object
MapptEditor_Properties.prototype.appendNewRow = function(tableObj) {
    var rowObj = document.createElement("tr");
    $(rowObj).addClass(Mappt_p_row_class);
    $(tableObj).append(rowObj);
    return rowObj;
}

MapptEditor_Properties.prototype.appendColumn = function(rowObj, propertyName, propertyValue, propertyType) {
    //create our two table columns
    var columnPropertyName = document.createElement("td");
    $(columnPropertyName).addClass(Mappt_p_column_name_class);
    $(rowObj).append(columnPropertyName);
    var columnPropertyValue = document.createElement("td");
    $(columnPropertyValue).addClass(Mappt_p_column_value_class);
    $(rowObj).append(columnPropertyValue);

    //place our name
    $(columnPropertyName).html(propertyName);
    
    if (_.isUndefined(propertyType)) {
	propertyType = "default";
    }

    if (propertyType == "default") {
	//create a text field with the field filled with the current value
	var columnTextInput = document.createElement("input");
	$(columnPropertyValue).append(columnTextInput);

	//set it to the text input type
	columnTextInput.type = "text";

	//change our property value for cases where we have an object
	if (_.isObject(propertyValue) && !_.isArray(propertyValue)) {
	    if (_.isEmpty(propertyValue)) {
		propertyValue = "";
	    }
	    else {
		var newPropertyValue = _.map(_.keys(propertyValue), function(elem) {
		    return elem + "=" + propertyValue[elem];
		});
		propertyValue = _.reduce(newPropertyValue, function(a,b) {
		    a += "," + b;
		    return a;
		});
	    }
	}
	columnTextInput.value = propertyValue;
	$(columnTextInput).addClass(Mappt_p_input_class);
    }
}
