$(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    console.log(windowWidth, windowHeight);

    mappt_viewer = new MapptViewer("mappt-viewer", windowWidth, windowHeight)
	.init()
	.setData(
	    [
		{
		    mapName: "Shuniah_1.svg", 
		    dataName: "Shuniah_1.svg.json",
		    name: "Shuniah - 1st Floor",
		},
		{
		    mapName: "Dorion_1.svg", 
		    dataName: "Dorion_1.svg.json",
		    name: "Dorion - 1st Floor",
		},
		{
		    mapName: "Aerial.svg",
		    dataName: "Aerial.svg.json",
		    name: "Confederation College",
		},
	    ])
	.setMap("Aerial.svg")
	.showRoute(101, 138);
    
    mappt_panel_where = new Mappt_Panel_Where("mappt-panel-where")
	.init()
	.appendToContainer("mappt-panel-where-container");

    mappt_panel_to = new Mappt_Panel_To("mappt-panel-to")
	.init()
	.appendToContainer("mappt-panel-to-container");

    var whereRoute = null;
    var toRoute = null;

    $("#mappt-panel-where-container")
	.find("select")
	.change(function() {
	    var sel = $("#mappt-panel-where-container").find("select option:selected")[0];
	    whereRoute = parseInt(sel.getAttribute("value"));
	    
	    console.log(whereRoute, toRoute);

	    if (_.isUndefined(toRoute) ||
	       whereRoute == toRoute) {
		return;
	    }
	    else {
		mappt_viewer.clearRoute();
		mappt_viewer.showRoute(whereRoute, toRoute);
	    }
	});

    $("#mappt-panel-to-container")
	.find("select")
	.change(function() {
	    var sel = $("#mappt-panel-to-container").find("select option:selected")[0];
	    toRoute = parseInt(sel.getAttribute("value"));
	    
	    console.log(whereRoute, toRoute);
	    if (_.isUndefined(whereRoute) ||
	       whereRoute == toRoute) {
		return;
	    }
	    else {
		mappt_viewer.clearRoute();
		mappt_viewer.showRoute(whereRoute, toRoute);
	    }

	});
});
