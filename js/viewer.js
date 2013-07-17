$(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
   
    mappt_viewer = new MapptViewer("mappt-viewer", windowWidth, windowHeight)
	.init()
	.setMap("Aerial.svg")
	.showRoute(101, 138);

});
