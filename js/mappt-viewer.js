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
	"overflow" : "hidden",
    })
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
    })
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
	h : this.context_height,
    };
}

MapptViewer.prototype.init = function() {
    var mapptViewer = this;
    
    this.currentView = {
	
    }
    return this;
}

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
	    
	    //doing something stupid
	    this.context_svg.setAttribute("preserveAspectRatio", "xMinYMin");

	    //the svg width and height
	    this.context_svg_width = this.context_svg.getAttribute('width').match(r)[0];
	    this.context_svg_height = this.context_svg.getAttribute('height').match(r)[0];
	    

	    //These are required in order to maintain the aspect ratio
	    //of the drawn SVG when zooming into the image.

	    //This effectively changes the SVG to main a fixed width
	    //or height respective to the context, while fixing height
	    //or width to new value to represent the canvas aspect
	    //ratio when scaling. An offset is also provided in order
	    //to ensure the SVG remains centered.
	    this.context_svg_height_offset = 0;
	    this.context_svg_width_offset = 0;
	    this.context_height_aspect = 0;
	    this.context_width_aspect = 0;
	  
	    //get the new svg size and offset based on the current context
	    //aspect ratio
	    var fixedSVGDim = this.correctAspect(this.context_width, this.context_height,
						 this.context_svg_width, this.context_svg_height);

	    
	    this.context_height_aspect = fixedSVGDim.height;
	    this.context_svg_height_offset = fixedSVGDim.height_offset;
	    this.context_width_aspect = fixedSVGDim.width;
	    this.context_svg_width_offset = fixedSVGDim.width_offset;
	   
	    //to simulate panning and zooming of our SVG, a DIV is
	    //resized and translated behind the main paper context.
	    //change our background context to reflect the changes.
	    $(this.contextObj_back).css({
		"width" : this.context_width_aspect,
		"height" : this.context_height_aspect,
		"top" : this.context_svg_height_offset,
		"left" : this.context_svg_width_offset,
	    });

	    //setup our paper in the front div container
	    this.context_paper = Raphael(this.context_id_foreground,
					 this.context_width,
					 this.context_height); 
	    
	    //setup our svg map in the back div container
	    $(this.contextObj_back).append(this.context_svg);
	    
	    //add a rectangle in front of the svg to allow clicks. It
	    // is added infront because we have no way to make our
	    // links and nodes to appear infront of it.
	    this.context_image = this.context_paper.rect(0,0, this.context_width, this.context_height);
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
		w : this.context_width,
		h : this.context_height,
	    };
	    
	    this.setViewBox(
		this.currentView.x, this.currentView.y, 
		this.currentView.w, this.currentView.h
	    );
	    	    

	}.bind(this),
	error: function (errObj, errString) {
	    log("Error: ", errString);
	},
	async: false,
    });

    return this;
}

//Used to set the position of the paper an exact place on the screen
MapptViewer.prototype.setViewBox = function(x,y,w,h) {    
    this.context_paper.setViewBox(x, y, w, h);

    //first, we're going to work out the width and height of our
    //context with respect to how it would appear on the screen.
    var context_width = this.context_width * this.context_width / w;
    var context_height = this.context_height * this.context_height / h;
    console.log("New context", context_width, context_height);

    //work out the new aspect with respect to our 
    var newAspect = this.correctAspect(context_width, context_height, 
				       this.context_svg_width, this.context_svg_height);
    console.log("New Aspect", newAspect);


    //apply our new translations to the aspect
    newAspect.width_offset += x;
    newAspect.height_offset += y;
    
    console.log("Changed Aspect", newAspect);

    $(this.contextObj_back).css({
	"width" : newAspect.width,
	"height" : newAspect.height,
	"top" : newAspect.width_offset,
	"left" : newAspect.height_offset,
    });

    //change our svg to fit the new DOM element
    this.context_svg.setAttribute("width", newAspect.width);
    this.context_svg.setAttribute("height", newAspect.height);

    return this;
}

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
}

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
}

MapptViewer.prototype.getPaperScale = function() {
    var scale = this.context_width / this.currentView.w;
    return scale;
}

//since the svg might not fit within the context, we need to correct
//for it.  this function finds out the differences in aspect between
//the svg and the screen and gives the resulting width and height
//required to fit the svg within the context without changing it's
//aspect. An offset is also provided to make sure the svg will be
//centered within the context.

//provided are the width and height of the context and the width and
//height of the svg. The return values are the changes in the width
//and height of the svg and the offset to center it within the
//context.
MapptViewer.prototype.correctAspect = function(width, height, svgWidth, svgHeight) {
    //temporaries
    var newContextWidth;
    var newContextHeight;
    
    //our corrected values
    var width_aspect;
    var height_aspect;
    var svgWidth_offset;
    var svgHeight_offset;

    //if the svg is wider than the context
    if ((width / height) < 
	(svgWidth / svgHeight)) {
	newContextWidth = width;
	newContextHeight = svgHeight * newContextWidth / svgWidth;
	svgHeight_offset = (height - newContextHeight) / 2;
	svgWidth_offset = 0;
	width_aspect = newContextWidth;
	height_aspect = newContextHeight;
    }
    else {//if the svg is narrower than the context
	newContextHeight = height;
	newContextWidth = svgWidth * newContextHeight / svgHeight;
	svgWidth_offset = (width - newContextWidth) / 2;
	svgHeight_offset = 0;
	height_aspect = newContextHeight;
	width_aspect = newContextWidth;
    }

    return { width: width_aspect,
	     height: height_aspect,
	     width_offset: svgWidth_offset,
	     height_offset: svgHeight_offset };
}
