/* MapptEditor properties extends the functionality of the mappt
 * editor by allowing you to change the attributes of currently
 * selected nodes.

 Dependencies:
 
 - MapptEditor
 - Underscore.js



 */

MapptEditor_Properties = function(parent, context_id) {
    //the MapptEditor parent we are referring to
    this.parent = parent;

    //The context id for our toolbar
    this.context_id = context_id;

    //Our toolbar context object
    this.contextObj = $("#" + this.context_id);

    (this.contextObj.length) || 
	log("ERROR: Provided ID for the mappt toolbar does not exist");

    //Includes all of the currently active properties
    this.activeProperties = {};


}

MapptEditor_Properties.prototype.init = function() {
    
}

//goes through the given object, and constructs a form to display onto the screen
MapptEditor_Properties.prototype.constructProperties = function(obj) {

}

MapptEditor_Properties.prototype.createTable = function() {
    
}

testObject = {position:[23.1,24.5], room:"rm505", id:0};
