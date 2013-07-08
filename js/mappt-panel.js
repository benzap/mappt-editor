/*
 * Mappt-Panels are pullup panels
 * 
 */

/***************************
  Mappt Panel Style Settings
 ***************************/

Mappt_P_Button_Width = "200px";
Mappt_P_Button_Height = "50px";


Mappt_Panel = function(context_id, align) {
    this.align = align;
    this.context_id = context_id;
    log(align);
};

Mappt_Panel.prototype.init = function() {
    log("hello");
};

Mappt_Panel_Where = function(context_id) {
    Mappt_Panel.call(this, context_id, "left");
};

Mappt_Panel.prototype = new Mappt_Panel();

Mappt_Panel_Where.prototype.init() {
    Mappt_Panel.prototype.init.call(this);
}
