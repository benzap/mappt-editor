/* MapptEditor properties extends the functionality of the mappt
 * editor by allowing you to change the attributes of currently
 * selected nodes.

 Dependencies:
 
 - MapptEditor
 - Underscore.js
 - jQuery


 */

Mappt_p_table_class = "mappt-properties-table";
Mappt_p_row_class = "mappt-properties-row";
Mappt_p_column_name_class = "mappt-properties-column-name";
Mappt_p_column_value_class = "mappt-properties-column-value";

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
	if (e.keyCode == Mappt_keycodes["1"]) {
	    this.updateActiveProperties();
	}
    }.bind(this));

    $(window).click(function(e) {
	var mapptEditor = this.parent;
	//we only need to catch clicks from the select node state
	if (mapptEditor.state != "selectNode") return;

	//check to see if the buffer size has changed
	// we're assuming this event willbe called after the other click methods
	


    }.bind(this));
    return this;
}

//after the active properties have been changed, update our active
//properties stored and return them. These new properties can then be
//applied to our PointInfoElement objects using an _.extend()
MapptEditor_Properties.prototype.updateActiveProperties = function() {
    //list of our mappt property tables
    var propertyTables = $("." + Mappt_p_table_class);
    for (var i = 0; i < this.activeProperties.length; i++) {
	//grab inside of our table body
	var currentTable = propertyTables[i];
	var rowLists = $(currentTable).find("." + Mappt_p_row_class);
	var currentObject = this.activeProperties[i];
	var j = 0;
	for (key in currentObject) {
	    if (key != $(rowLists[j]).find("." + Mappt_p_column_name_class)[0].innerHTML) {
		log("Error: In updateActiveProperties, keys don't match up");
	    }
	    //this is inside of our table column that contains our input
	    var newValueObj = $(rowLists[j]).find("." + Mappt_p_column_value_class)[0];
	    
	    //by default, we get the input DOM element's value
	    var ourValueObj = $(newValueObj).find("input")[0];
	    var ourValue = $(ourValueObj).val();

	    this.activeProperties[i][key] = ourValue;
	    j += 1;
	}
    }
    log(this.activeProperties);
    return this.activeProperties;
}

//goes through the given object, and constructs a form to display onto the screen
MapptEditor_Properties.prototype.appendProperties = function(obj) {
    var objectList = obj;

    for (var i=0; i < objectList.length; i++) {
	var iObj = objectList[i];
	var tableObj = this.appendNewTable();
	for (key in iObj) {
	    var rowObj = this.appendNewRow(tableObj);
	    this.appendColumn(rowObj, key, iObj[key]);
	}
    }

    //throw all of the appended properties into our active properties
    this.activeProperties = this.activeProperties.concat(obj);
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
	columnTextInput.value = propertyValue;
    }
}

testObject = {position:[23.1,24.5], room:"rm505", id: 0};
testObject2 = {position:[10.1,0.01], room:"shuniah", id: 5};
testObject3 = {position:[10.1,0.01], room:"shuniah", id: 5};
larray = [testObject, testObject2]
