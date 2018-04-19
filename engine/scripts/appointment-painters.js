// *************************************************************************************************
// File name: dbgrid-painters.js
// Last modified on
// 24-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JAppointmentsPainter
//**************************************************************************************************
Class.Inherits(JAppointmentsPainter, JControlPainter);
function JAppointmentsPainter(Control) {
	JAppointmentsPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

JAppointmentsPainter.prototype.classID = "JAppointmentsPainter";
JAppointmentsPainter.prototype.type = "appointments";

// JAppointmentsPainter.prototype.Element = function() {
    // return this.elementContainer;
// };

JAppointmentsPainter.prototype.Paint = function() {
	JAppointmentsPainter.prototype.parent.prototype.Paint.call(this); 
	
	var container = CreateElement("div", this.Control.container, "", "app-container")
		
	this.SetContainer(container);
};

//**************************************************************************************************
// JAppointmentPainter
//**************************************************************************************************
Class.Inherits(JAppointmentPainter, JControlPainter);
function JAppointmentPainter(Control) {
	JAppointmentPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

JAppointmentPainter.prototype.classID = "JAppointmentPainter";
JAppointmentPainter.prototype.type = "appointment";

JAppointmentPainter.prototype.CalculateHeight = function(start, finish) {	
	var difference = (finish.getHours()*60+finish.getMinutes()) - (start.getHours()*60+start.getMinutes());
	var offset = parseInt(difference/this.Control.appointments.scale);
	return difference+offset-1;
};

JAppointmentPainter.prototype.CalculateTop = function(start) {	
	var offset = this.Control.appointments.startTime*60;
	
	// alerts(offset, offset2)
	var top = (start.getHours()*60+start.getMinutes()) - offset;
	
	var offset2 = parseInt(top/this.Control.appointments.scale);
	// alerts(parseInt(top/this.Control.appointments.scale));
	// var difference = (finish.getHours()*60+finish.getMinutes()) - (start.getHours()*60+start.getMinutes());
	
	return top+offset2;
};

JAppointmentPainter.prototype.Paint = function() {
	JAppointmentPainter.prototype.parent.prototype.Paint.call(this); 
	
	// var start = this.Control.start.addMinutes(parseInt(-this.Control.appointments.timezoneOffset));
	// var finish = this.Control.finish.addMinutes(parseInt(-this.Control.appointments.timezoneOffset));
	var start = this.Control.start;
	var finish = this.Control.finish;
	var start = this.Control.start;
	var hours = start.getHours();
	var minutes = start.getMinutes();
	
	var container = CreateElement("div", this.Control.container, "", "appointment")
			.css("width", this.Control.width+"%")
			.css("left", this.Control.left+"%")
			.css("height", this.CalculateHeight(start, finish))
			.css("top", this.CalculateTop(start, finish))
			.attr("app-id", this.Control.id)
			
	var body = CreateElement("div", container)
		.css("background", this.Control.color)
		.attr("app-sec", "content")
		
	var header = CreateElement("div", body)
		.attr("app-sec", "header")
	
	var time = CreateElement("div", header)
		.attr("app-sec", "time")
		.html(("{0}:{1}-{2}:{3}").format(hours.strZero(2), minutes.strZero(2), finish.getHours().strZero(2), finish.getMinutes().strZero(2)))
	
	this.SetContainer(container);
};
