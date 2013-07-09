$(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    var mappt_viewer = new MapptViewer("mappt-viewer", windowWidth, windowHeight)
	.init()
	.setMap("Shuniah_1.svg");

    mappt_panel_where = new Mappt_Panel_Where("mappt-panel-where")
	.init()
	.appendToContainer("mappt-panel-where-container");

    mappt_panel_to = new Mappt_Panel_To("mappt-panel-to")
	.init()
	.appendToContainer("mappt-panel-to-container");

});
