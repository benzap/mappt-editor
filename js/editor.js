$( function() {
    //for notifications
    $("#notify-container").notify({
	speed: 500,
    });

    mappt = new MapptEditor("mappt-editor-main", 1024, 768)
	.init()
	.setMap("Aerial.svg");

    mappt_toolbar = new MapptEditor_Toolbar(mappt, "mappt-editor-toolbar")
	.init();

    mappt_properties = new MapptEditor_Properties(mappt, "mappt-editor-properties")
	.init();

    mappt_layout = new MapptEditor_LayoutChanger(mappt, "mappt-editor-layout-changer")
	.init(
	    [
		"Aerial.svg",
		"Dorion_1.svg",
		"Dorion_2.svg",
		"Mcintyre_1.svg",
		"Shuniah_1.svg",
		"Shuniah_2.svg",
	    ]);

});
