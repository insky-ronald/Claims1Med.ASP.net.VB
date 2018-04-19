//**************************************************************************************************
// JLayout
//**************************************************************************************************
Class.Inherits(JLayout, JControl);
function JLayout(Params) {
    JLayout.prototype.parent.call(this, Params);
};

JLayout.prototype.classID = "JLayout";

JLayout.prototype.Initialize = function(Params) {
    JLayout.prototype.parent.prototype.Initialize.call(this, Params);
    this.Container = Params.Container;
};

JLayout.prototype.Resize = function(size) {
    this.Painter.Resize(size);
};

JLayout.prototype.StaticContainer = function() {
    return this.Painter.Static;
};

JLayout.prototype.ContentContainer = function() {
    return this.Painter.Content;
};

JLayout.prototype.PositionAt = function(x, y) {
    this.Painter.Container.css("left", x).css("top", y);
};
