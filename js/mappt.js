$(function() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    mappt = new Mappt("mappt-main", windowWidth, windowHeight)
	.init()
	.setData(
	    [
		{
		    mapName: "Shuniah_1.svg", 
		    dataName: "Shuniah_1.svg.json",
		    name: "Shuniah - 1st Floor",
		},
		{
		    mapName: "Shuniah_2.svg", 
		    dataName: "Shuniah_2.svg.json",
		    name: "Shuniah - 2nd Floor",
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
	    ]);

    mappt.showFullRoute(mappt.getPartialRoute(133, "Aerial.svg", 539, "Shuniah_1.svg"));
    //mappt.getFullRoute(125, "Aerial.svg", 170, "Shuniah_2.svg")
});
