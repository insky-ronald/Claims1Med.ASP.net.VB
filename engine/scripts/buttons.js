// *************************************************************************************************
// File name: buttons.js
// Last modified on
// 06-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JButton
//**************************************************************************************************
Class.Inherits(JButton, JControl);
function JButton(Params) {
    JButton.prototype.parent.call(this, Params);
};
JButton.prototype.classID = "JButton";

JButton.prototype.DefaultPainter = function() {
    return new JButtonPainter(this);
};

JButton.prototype.Click = function() {
	if(this.enabled && this.click) this.click(this);
}

JButton.prototype.SetEnabled = function(enabled) {
	this.elementContainer.attr("btn-state", this.enabled = enabled ? "enabled": "disabled")
};

JButton.prototype.Initialize = function(params) {
    JButton.prototype.parent.prototype.Initialize.call(this, params);
    this.id = params.id;
    this.caption = params.caption;
    this.enabled = defaultValue(params.enabled, true);
    this.hint = params.hint;
    this.container = params.container;
    this.click = params.click; 
	
    // this.dataBind = params.dataBind;
    // this.dataEvent = params.dataEvent;
	// alerts(this.dataBind, this.dataEvent)
	// if(this.dataBind && this.dataEvent) {
		// var self = this;
		// this.dataBind.Events.OnEditState.add(function(dataset, editing) {
			// self.dataEvent(dataset, self);
		// };
	// };
};

//**************************************************************************************************
// Button functions
//**************************************************************************************************
function CreateButton(p) {
	return new JButton({
		container: p.container,
		caption: p.caption,
		hint: p.hint,
		enabled: p.enabled,
		dataBind: p.dataBind,
		dataEvent: p.dataEvent,
		click: p.click,
		Painter: {
			painterClass: JButtonPainter,
			style: p.style
		}
	});
};
