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

	this.draw = function () {
	
	}
	
};



var div, parent;
var m;

var img = "img/floor.png";
var myImg = new Image();
myImg.src = img;


var outer = $("<div/>");

myImg.onload = function(){
	var width = myImg.width;
	var height = myImg.height;
	outer.css({width: width, height: height,
		position: "absolute"
	});

	div = $("<div/>").css({width: width, height: height,
		position: "absolute"
	});

	outer.append(div);
	m = new mapTrack(div, img);
	div.data("mapTrack", m);
	
	$(".main").append(outer);
}

