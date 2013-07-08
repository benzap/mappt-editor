$(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    
    mappt_viewer = new MapptViewer("mappt-viewer", windowWidth, windowHeight)
	.init()
	.setMap("Shuniah_1.svg");

    mappt_panel_where = new Mappt_Panel_Where();
    

});
