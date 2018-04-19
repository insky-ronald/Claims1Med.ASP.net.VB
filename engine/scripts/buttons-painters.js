// *************************************************************************************************
// File name: buttons-painters.js
// Last modified on
// 06-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JButtonPainter
//**************************************************************************************************
Class.Inherits(JButtonPainter, JControlPainter);
function JButtonPainter(Control) {
    JButtonPainter.prototype.parent.call(this, Control);
};

JButtonPainter.prototype.type = "btn";
JButtonPainter.prototype.classID = "JButtonPainter";

JButtonPainter.prototype.Paint = function() {
    JButtonPainter.prototype.parent.prototype.Paint.call(this);
	
	var container;
	
	if(this.GetParam("style", "silver") == "text") {
		container = CreateElement("a", CreateElement("div", this.Control.container, "", "button-text"))
			.html(this.Control.caption)
	} else {
		container = CreateElement("div", this.Control.container, "", "button")
			.attr("btn-state", this.Control.enabled ? "enabled": "disabled")
			.attr("btn-color", this.GetParam("style", "silver"))
			.html(this.Control.caption)
	}
	
    container.click(function() {
		$(this).data("object").Click();
	});

	this.SetContainer(container);
	
	if(this.Control.hint) 
		desktop.SetHint(container, this.Control.hint);
};

