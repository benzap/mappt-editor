/* MapptEditor properties extends the functionality of the mappt
 * editor by allowing you to change the attributes of currently
 * selected nodes.

 Dependencies:
 
 - MapptEditor
 - Underscore.js
 - jQuery


 */

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
    this.activeProperties = {};

}

MapptEditor_Properties.prototype.init = function() {
    return this;
}

//goes through the given object, and constructs a form to display onto the screen
MapptEditor_Properties.prototype.appendProperties = function(obj) {
    log(obj);
    var objectList = obj;

    for (var i=0; i < objectList.length; i++) {
	var iObj = objectList[i];
	var tableObj = this.appendNewTable();
	for (key in iObj) {
	    var rowObj = this.appendNewRow(tableObj);
	    this.appendColumn(rowObj, key, iObj[key]);
	}
    }
}

//creates a new table at the top of the context's DOM and stores this
//table as a table obj. returns the table object.
MapptEditor_Properties.prototype.appendNewTable = function() {
    var tableObj = document.createElement("table");
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
    $(tableObj).append(rowObj);
    return rowObj;
}

MapptEditor_Properties.prototype.appendColumn = function(rowObj, propertyName, propertyValue, propertyType) {
    //create our two table columns
    var columnPropertyName = document.createElement("td");
    $(rowObj).append(columnPropertyName);
    var columnPropertyValue = document.createElement("td");
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

larray = [testObject, testObject2]
