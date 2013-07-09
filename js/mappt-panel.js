/*
 * Mappt-Panels are pullup panels
 */

/***************************
  Mappt Panel Main Style Settings
 ***************************/
//the div class representing the entire div
// for a panel
Mappt_P_Class = "mappt-panel";

//amount of time animating
Mappt_P_AnimationTime = 500;

/***************************
  Mappt Panel Button Style Settings
 ***************************/
//the div class representing the panel button
Mappt_P_Button_Class = "mappt-panel-button";

//the button default height and width
Mappt_P_Button_Width = "200px";
Mappt_P_Button_Height = "50px";

/***************************
  Mappt Panel Container Style Settings
 ***************************/
Mappt_P_Container_Class = "mappt-panel-container";
Mappt_P_Container_Width = "250px";
Mappt_P_Container_Height = "200px";

//a common panel prototype that is inherited
Mappt_Panel = function(context_id, align) {
    //the alignment of the panel --> "left", "right"
    this.align = align;
    //the div ID representing this panel
    this.context_id = context_id;
    //boolean which determines if the panel is showing
    this.bDisplay = false;

    return this;
};

Mappt_Panel.prototype.init = function() {
    this.contextObj = $("#" + this.context_id);
    (this.contextObj.length) || log("ERROR: context ID does not exist");

    //create our button
    this.contextObj_button = document.createElement("div");
    $(this.contextObj_button)
	.addClass(Mappt_P_Button_Class)
	.css({
	    position: "relative",
	    display: "inherited",
	    float: this.align,
	    width: Mappt_P_Button_Width,
	    height: Mappt_P_Button_Height,
	});
    
    //create our container
    this.contextObj_container = document.createElement("div");
    $(this.contextObj_container)
	.addClass(Mappt_P_Container_Class)
	.css({
	    position: "relative",
	    display: "inherited",
	    clear: this.align,
	    width: 0, //Mappt_P_Container_Width,
	    height: 0, //Mappt_P_Container_Height,
	});

    //set the div alignment for our main div
    if (this.align == "left") {
	$(this.contextObj).css({
	    left: 0,
	});
    }
    else if (this.align == "right") {
	$(this.contextObj).css({
	    right: 0,
	});
    }
    
    //css styling for our main div
    //and appending our button and container
    $(this.contextObj)
	.addClass(Mappt_P_Class)
	.css({
	    position: "fixed",
	    bottom: 0,
	})
	.append(this.contextObj_button)
	.append(this.contextObj_container);
    
    //bind our onclick event
    $(this.contextObj).on("click", "." + Mappt_P_Button_Class, function() {
	log("hello");
	this.toggleContext();
    }.bind(this));

    return this;
};

Mappt_Panel.prototype.setText = function(theText) {
    var textDOM = document.createElement("p");
    textDOM.innerHTML = theText;
    $(this.contextObj_button).append(textDOM);
    return this;
}

Mappt_Panel.prototype.displayContext = function(_bAnimate) {
    var bAnimate = _bAnimate;
    if (_.isUndefined(_bAnimate)) {
	bAnimate = true;
    }

    var animationTime;
    if (bAnimate) {
	animationTime = Mappt_P_AnimationTime;
    }
    else {
	animationTime = 0;
    }

    $(this.contextObj_container)
	.css({
	    display: "inherited",
	    width: Mappt_P_Container_Width,
	})
	.animate({
	    height: Mappt_P_Container_Height,
	}, animationTime);

    this.bDisplay = true;
    return this;
}

Mappt_Panel.prototype.hideContext = function(_bAnimate) {
    var bAnimate = _bAnimate;
    if (_.isUndefined(_bAnimate)) {
	bAnimate = true;
    }

    var animationTime;
    if (bAnimate) {
	animationTime = Mappt_P_AnimationTime;
    }
    else {
	animationTime = 0;
    }

    $(this.contextObj_container)
	.css({
	})
	.animate({
	    height: 0,
	}, animationTime, function() {
	    $(this).css({
		//display: "none",
		width: 0,
	    });
	});
    this.bDisplay = false;
    return this;
}

Mappt_Panel.prototype.toggleContext = function(_bAnimate) {
    var bAnimate = _bAnimate;
    if (_.isUndefined(_bAnimate)) {
	bAnimate = true;
    }

    if (this.bDisplay) {
	this.hideContext(_bAnimate);
	this.bDisplay = false;
    }
    else {
	this.displayContext(_bAnimate);
	this.bDisplay = true;
    }
    return this;
}

//Panel representing "where are you?" in the bottom left
Mappt_Panel_Where = function(context_id) {
    Mappt_Panel.call(this, context_id, "left");
    return this;
};

Mappt_Panel_Where.prototype = new Mappt_Panel();

Mappt_Panel_Where.prototype.init = function() {
    Mappt_Panel.prototype.init.call(this);
    this.setText("Where are you?");
    return this;
}

//Panel representing "where are you going?" in the bottom right
Mappt_Panel_To = function(context_id) {
    Mappt_Panel.call(this, context_id, "right");
    return this;
};

Mappt_Panel_To.prototype = new Mappt_Panel();

Mappt_Panel_To.prototype.init = function() {
    Mappt_Panel.prototype.init.call(this);
    this.setText("Where are you going?");
    return this;
}