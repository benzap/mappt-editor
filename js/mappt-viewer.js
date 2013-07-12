var MapptViewer_Image_Path = "./floorPlans_svg/";
var MapptViewer_Data_Path = "./floorPlans_data/";

MapptViewer = function(context_id, context_width, context_height) {

    //The id of the DIV element for our top-level container
    this.context_id = context_id;
    //The width of our Raphael paper
    this.context_width = context_width;
    //The height of our Raphael paper
    this.context_height = context_height;

    this.context_id_background = this.context_id + "-back";
    this.context_id_foreground = this.context_id + "-front";

    //The SVG width and height values
    this.context_svg_width = null;
    this.context_svg_height = null;

    //our current context
    this.contextObj = $("#" + context_id);

    $(this.contextObj).css({
	"position" : "relative",
	"top" : "0px",
	"left" : "0px",
	"width" : this.context_width,
	"height" : this.context_height,
	"overflow" : "hidden",
    });

    //check if the given ID exists
    (this.contextObj.length) || 
	log("ERROR: Provided ID does not match any element within the DOM");

    //create our background div and foreground divs
    //the background div will hold our SVG image
    this.contextObj_back = document.createElement("div");
    this.contextObj_back.setAttribute("id", this.context_id_background);
    $(this.contextObj_back).css({
	"position" : "absolute",
	"z-index" : 0,
	"width" : "100%",
	"height" : "100%",
	"overflow" : "hidden"
    });
    $(this.contextObj).append(this.contextObj_back);
    
    //create our foreground div
    //the foreground div will hold our raphael paper
    this.contextObj_front = document.createElement("div");
    this.contextObj_front.setAttribute("id", this.context_id_foreground);
    $(this.contextObj_front).css({
	"position" : "absolute",
	"z-index" : 1,
	"width" : "100%",
	"height" : "100%",
	"overflow" : "hidden",
    });
    $(this.contextObj).append(this.contextObj_front);


    //contains the image URL full path
    this.imageURL = null;
    //contains the name of the image
    this.imageName = null;


    //get the offset of our context in order to draw on the paper correctly
    this.contextOffset = this.contextObj.offset();

    //contains the paper for our Raphael
    this.context_paper = null;
    //contains the image for our paper
    this.context_image = null;

    //contains the svg for our paper
    this.context_svg = null;

    this.currentView = {
	x : 0.0,
	y : 0.0,
	w : this.context_width,
	h : this.context_height
    };
}

MapptViewer.prototype.init = function() {
    var mapptViewer = this;
    
    this.currentView = {
	
    };
    return this;
};

MapptViewer.prototype.setMap = function(imageName) {
    this.imageName = imageName;
    this.imageURL = MapptViewer_Image_Path + this.imageName;

    $(this.contextObj_back).empty();

        jQuery.ajax({
	type: 'GET',
	url: this.imageURL, //this is the svg file loaded as xml
	dataType: 'xml',
	cache: false,
	success: function(svgXML) {
	    this.context_svg = svgXML.getElementsByTagName('svg')[0];

	    //regex to find a number in a string
	    var r = /\d+/;
	    
	    //removing the aspect ratio preservation.
	    this.context_svg.setAttribute("preserveAspectRatio", "none");

	    //the svg width and height
	    this.context_svg_width = this.context_svg.getAttribute('width').match(r)[0];
	    this.context_svg_height = this.context_svg.getAttribute('height').match(r)[0];
	   
	    //to simulate panning and zooming of our SVG, a DIV is
	    //resized and translated behind the main paper context.
	    //change our background context to reflect the changes.
	    $(this.contextObj_back).css({
		"width" : this.context_svg_width,
		"height" : this.context_svg_height,
		"top" : 0,
		"left" : 0,
		"overflow" : "hidden",
	    });

	    //setup our paper in the front div container
	    this.context_paper = Raphael(this.context_id_foreground,
					 this.context_svg_width,
					 this.context_svg_height); 
	    
	    //setup our svg map in the back div container
	    $(this.contextObj_back).append(this.context_svg);
	    
	    //add a rectangle in front of the svg to allow clicks. It
	    // is added infront because we have no way to make our
	    // links and nodes to appear infront of it.
	    this.context_image = this.context_paper.rect(0,0, this.context_svg_width, this.context_svg_height);
	    this.context_image.attr({
		fill: "#ffffff", 
		'fill-opacity': 0.0,
		stroke: "#000000"});

	    //The view decides on the current position within our paper
	    // Allows for easier panning and zooming functionality
	    // the currentView is used by several functions order to ensure proper
	    // translations
	    this.currentView = {
		x : 0.0,
		y : 0.0,
		w : this.context_svg_width,
		h : this.context_svg_height
	    };
	    
	    this.setViewBox(
		this.currentView.x, this.currentView.y, 
		this.currentView.w, this.currentView.h
	    );
	    	    

	}.bind(this),
	error: function (errObj, errString) {
	    log("Error: ", errString);
	},
	async: false
    });

    return this;
};

//Used to set the position of the paper an exact place on the screen
MapptViewer.prototype.setViewBox = function(x,y,w,h) {    
    this.context_paper.setViewBox(x, y, w, h);

    console.log(x,y,w,h);

    //fix for our background SVG image if it isn't the same size as
    //our raphael paper. Calculate the ratio of the raphael paper
    var viewString = "";
    viewString += String(x) + " ";
    viewString += String(y) + " ";
    viewString += String(w) + " ";
    viewString += String(h);

    //Now that we have a separate svg element, we need to also change
    //the view of our svg
    this.context_svg.setAttribute("viewBox", viewString);

    return this;
};

//used to translate the screen for panning and zooming
MapptViewer.prototype.translatePaper = function(x, y, s) {
    this.currentView.x = this.currentView.x - x;
    this.currentView.y = this.currentView.y - y;
    this.currentView.w = this.currentView.w / s;
    this.currentView.h = this.currentView.h / s;
    this.setViewBox(
	this.currentView.x,
	this.currentView.y,
	this.currentView.w,
	this.currentView.h
    );

    return this;
};

MapptViewer.prototype.fitScreen = function() {
    this.currentView.x = 0;
    this.currentView.y = 0;
    this.currentView.w = this.context_width;
    this.currentView.h = this.context_height;
    
    this.setViewBox(
	this.currentView.x,
	this.currentView.y,
	this.currentView.w,
	this.currentView.h
    );

    return this;
};

MapptViewer.prototype.getPaperScale = function() {
    var scale = this.context_width / this.currentView.w;
    return scale;
};

