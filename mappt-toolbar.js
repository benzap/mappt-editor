/* MapptEditor toolbar extends the functionality of the mappt editor
 * and provides a way to change the state from another div element
 * area. 

 Dependencies:
 - MapptEditor

 How to Use:

 mappt = new MapptEditor("mappt-editor-main", 1024, 768)
 .setMap("floorPlans_svg/Dorion_1.svg")
 .init()
 .translatePaper(200, 100, 1.0);
 
 mappt_toolbar = new MapptEditor_toolbar(mappt, "mappt-editor-toolbar", 1024, 100);

 */

MapptEditor_Toolbar = function(parent, context_id) {
    //the MapptEditor parent we are referring to
    this.parent = parent;

    //The context id for our toolbar
    this.context_id = context_id;

    //Our toolbar context object
    this.contextObj = $("#" + this.context_id);

    (this.contextObj.length) || 
	log("ERROR: Provided ID for the mappt toolbar does not exist");

    //list containing mappt button's, which change the state
    // [ MapptButton ]
    this.buttonList = [];
    
}

MapptEditor_Toolbar.prototype.init = function() {
    //populate our context object with several buttons
    this.buttonList.push(new MapptButton(this, "Add Node", "addNode"));
    this.buttonList[0].setDisabled();
    
    this.buttonList.push(new MapptButton(this, "Remove Node", "removeNode"));
    this.buttonList.push(new MapptButton(this, "Add Link", "addLink"));
    this.buttonList.push(new MapptButton(this, "Remove Link", "removeLink"));
    this.buttonList.push(new MapptButton(this, "Select Node", "selectNode"));
    this.buttonList.push(new MapptButton(this, "Move Node", "moveNode"));
    this.buttonList.push(new MapptButton(this, "Route Node", "routeNode"));

    //track keypresses to work out if we need to enable to disable
    // buttons for when people use keyboard hotkeys
    $(window).keypress(function(e) {
	if (e.keyCode == Mappt_keycodes["1"]) {
	    this.reset();
	    this.getButtonByState("addNode").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["2"]) {
	    this.reset();
	    this.getButtonByState("removeNode").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["3"]) {
	    this.reset();
	    this.getButtonByState("addLink").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["4"]) {
	    this.reset();
	    this.getButtonByState("removeLink").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["5"]) {
	    this.reset();
	    this.getButtonByState("selectNode").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["6"]) {
	    this.reset();
	    this.getButtonByState("moveNode").setDisabled()
	}
	else if (e.keyCode == Mappt_keycodes["7"]) {
	    this.reset();
	    this.getButtonByState("routeNode").setDisabled()
	}
    }.bind(this));
}

MapptEditor_Toolbar.prototype.getButtonByState = function(state) {
    return _.find(this.buttonList, function(elem) {
	return (elem.state == state);
    });
}

MapptEditor_Toolbar.prototype.reset = function() {
    _.map(this.buttonList, function(elem) {
	elem.setEnabled();
    });
}

//When mappt button is created, it creates and appends itself as a button within the
// assigned mappt toolbar and uses the provided label.
MapptButton = function(parent, label, state) {
    //The parent or owner of this button (MapptEditorToolbar)
    this.parent = parent;
    
    //the name of the state that the button will 
    this.label = label;

    //the state that this button controls
    this.state = state;

    //contains the DOM node element
    this.node = document.createElement("button");
    //this.node.type = "submit";
    //this.node.name = label;
    //this.node.value = label;
    
    $(this.node).html(label).css({});

    $(this.node).click(function(e) {
	//get my parent
	var mapptToolbar = this.parent;
	
	//get my grandparent
	var mapptEditor = mapptToolbar.parent;

	//change the mode
	mapptEditor.mode(this.state);

	//reset all of our buttons so that they
	// are not disabled
	_.map(mapptToolbar.buttonList, function(elem) {
	    elem.setEnabled();
	});

	this.setDisabled();


    }.bind(this));
    $(parent.contextObj).append(this.node);
}

MapptButton.prototype.setEnabled = function() {
    this.node.disabled = false;
}

MapptButton.prototype.setDisabled = function() {
    this.node.disabled = true;
}
