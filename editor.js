$( function() {
    //for notifications
    $("#notify-container").notify({
	speed: 500,
    });

    //mappt = new MapptEditor("mappt-editor-main", 1024, 768, "img/floor.png");
    mappt = new MapptEditor("mappt-editor-main", 1024, 768)
	.setMap("floorPlans_svg/Dorion_1.svg")
	.init()
	.translatePaper(200, 100, 1.0);

    mappt_toolbar = new MapptEditor_Toolbar(mappt, "mappt-editor-toolbar")
	.init();


});
