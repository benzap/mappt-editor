/*
  MpptEditor is a drop-in editor to produce layouts and points on a
map. This information can be used to provide data for path traversal
applications.

Dependencies:
- Raphael
- JQuery

Class Structures:
- 
- MapptEditor

*/

MapptEditor = function (context_id, context_width, context_height, imageURL) {
    //The id of the DIV element to place our MapptEditor
    this.context_id = context_id;
    //The width of our Raphael paper
    this.context_width = context_width;
    //The height of our Raphael paper
    this.context_height = context_height;

    //our current context
    this.contextObj = $("#" + context_id);

    //check if the given ID exists
    (this.contextObj.length) || 
	console.log("ERROR: Provided ID does not match any element within the DOM");

    //The image URL
    this.imageURL = typeof imageURL !== 'undefined' ? imageURL : null;

    //The image object
    this.imageObject = new Image();
    
    this.imageObject.onload = function() {

    }

    this.imageObject.onerror = function() {
	console.log("ERROR: the imageURL provided does not exist");
    }

    //Allocate our image if it exists
    if (this.imageURL != null) {
	this.imageObject.src = this.imageURL;
    }

    this.imageObject.width = this.context_width;
    this.imageObject.height = this.context_height;	    

    //contains the paper for our Raphael
    this.context_paper = null;
    //contains the image for our paper
    this.context_image = null;

}

MapptEditor.prototype.setImage = function(imageURL) {
    (this.imageURL != null) || 
	console.log("ERROR: Provided input is not a URL");
    this.imageURL = imageURL;
    this.imageObject.src = imageURL;
}

MapptEditor.prototype.init = function() {
    (this.imageURL) ||
	console.log("ERROR: No Image was provided");
    this.context_paper = Raphael(this.context_id, this.context_width, this.context_height);

    this.context_image = this.context_paper.image(this.imageURL, 
				     0, 0,
				     this.context_width,
				     this.context_height);
    this.contextObj.css(
	{
	    width: this.context_width, 
	    height: this.context_height,
	    position: "relative",
	});
}


mapTrack = function (jqobj, img) {

    var width = jqobj.width(); 
    var height = jqobj.height() || jqobj.width();
    var paper = Raphael(jqobj[0], this.w, this.h);


    var map = paper.image(img, 0, 0, width, height);
    var points = [];

    map.click(function(e){
	points.push(paper.circle(e.clientX, e.clientY, 10).attr("fill","#ff0000"));
    })

    this.mouseover = function (e) {
    }
    this.mouseout = function (e) {
    }    
};

//! The name of the div element that holds our map
var mppt_context = "#mappt-editor-main";

//! Mppt Editor Object
var mppt_editor;

//! Test: test image
var img = "img/floor.png";
var myImg = new Image();
//myImg.src = img;
/*
myImg.onload = function() {
    var width = myImg.width;
    var height = myImg.height;


    div = $(mppt_context).css(
	{
	    width: width, 
	    height: height,
	    position: "absolute",
	    border: "0px solid black"
	});

    m = new mapTrack(div, img);
    div.data("mapTrack", m);
    
}
*/

mappt = new MapptEditor("mappt-editor-main", 1024, 768, "img/floor.png");
mappt.init();