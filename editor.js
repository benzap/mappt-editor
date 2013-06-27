$( function() {
    //for notifications
    $("#notify-container").notify({
	speed: 500,
    });

    mappt = new MapptEditor("mappt-editor-main", 1024, 768)
	.setMap("floorPlans_svg/Dorion_1.svg")
	.init();

    mappt_toolbar = new MapptEditor_Toolbar(mappt, "mappt-editor-toolbar")
	.init();

    mappt_properties = new MapptEditor_Properties(mappt, "mappt-editor-properties")
	.init();

});
