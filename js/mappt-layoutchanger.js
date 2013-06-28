/*
  Provides a utility that includes a different context consisting of a
  list of map layouts that can be swapped in and out of the editor.

  Dependencies:

  - MapptEditor
  - underscore.js

 */

//css .class properties to style the layout changer
Mappt_c_ul_class = "mappt-layout-changer-ul";
Mappt_c_li_class = "mappt-layout-changer-li";

MapptEditor_LayoutChanger = function(parent, context_id) {
    //the MapptEditor parent we are referring to
    this.parent = parent;

    //The context id for our toolbar
    this.context_id = context_id;

    //Our toolbar context object
    this.contextObj = $("#" + this.context_id);

    (this.contextObj.length) || 
	log("ERROR: Provided ID for the mappt layout changer does not exist");
}

MapptEditor_LayoutChanger.prototype.init = function(mapList) {
    if (!_.isUndefined(mapList)) {
	this.setMapList(mapList);
    }
}

MapptEditor_LayoutChanger.prototype.setMapList = function(mapList) {
    var listContainer = this.createList();
    for (var i = 0; i < mapList.length; i++) {
	this.appendMap(listContainer, mapList[i]);
    }
}

MapptEditor_LayoutChanger.prototype.createList = function() {
    var listContainer = document.createElement("ul");
    $(listContainer).addClass(Mappt_c_ul_class);
    $(this.contextObj).append(listContainer);
    return listContainer;
}

MapptEditor_LayoutChanger.prototype.appendMap = function(listContainer, mapName) {
    var listElement = document.createElement("li");
    $(listElement).addClass(Mappt_c_li_class);
    $(listElement).text(mapName);
    var mapptEditor = this.parent;
    $(listElement).click(function(e) {
	mapptEditor.setMap($(this).text());
    });
    $(listContainer).append(listElement);
    return listElement;
}
