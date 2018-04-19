//==================================================================================================
// File name: appointment.js
//==================================================================================================
// function JAppointments(Params)
//==================================================================================================
//**************************************************************************************************
// JAppointments
//**************************************************************************************************
Class.Inherits(JAppointments, JControl);
function JAppointments(Params) {
    JAppointments.prototype.parent.call(this, Params);
};
JAppointments.prototype.classID = "JAppointments";

JAppointments.prototype.DefaultPainter = function() {
    return new JAppointmentsPainter(this);
};

// JAppointments.prototype.Click = function() {
	// if(this.enabled && this.click) this.click(this);
// }

// JAppointments.prototype.SetEnabled = function(enabled) {
	// this.elementContainer.attr("btn-state", this.enabled = enabled ? "enabled": "disabled")
// };

JAppointments.prototype.Initialize = function(params) {
    JAppointments.prototype.parent.prototype.Initialize.call(this, params);
    // this.id = params.id;
    // this.timezoneOffset = (new Date()).getTimezoneOffset();
	// alerts(this.timezoneOffset)
    this.scale = params.scale;
    this.startTime = params.startTime;
    this.date = params.date;
    // this.enabled = defaultValue(params.enabled, true);
    // this.hint = params.hint;
    this.container = params.container;
    // this.click = params.click; 
	this.appointments = new JList();
	// this.columns = new JList();
};

JAppointments.prototype.AddAppointment = function(params) {
	params.container = this.elementContainer;
	params.appointments = this;
	var appointment = new JAppointment(params);
	this.appointments.add(
		params.id,
		appointment
	);
	
	return appointment;
};

JAppointments.prototype.ClashOnRight = function(appointment, start, clashGroup) {
	var count = 0;

	for (var i = start; i <= clashGroup.length-1 ; i++) {
		var clash = false;
		var group = clashGroup[i];
		for (var j = 0; j <= group.length-1 && !clash; j++) {
			var appointment2 = group[j];
			if(appointment.id != appointment2.id) {
				if(appointment.Clash(appointment2)) {
					clash = true;
				};
			};
		};

		if(!clash)
			count += 1
		else
			return count;
	};

	return count;
};

JAppointments.prototype.GetClashGroup = function(appointment, clashGroup) {

	if(clashGroup.length == 0) {
		clashGroup.push([appointment]);
		return;
	};

	var appointment2 = null;
	var group = null;
	var clash = false;

	for (var i = 0; i <= clashGroup.length-1 ; i++) {
		clash = false;
		group = clashGroup[i];
		for (var j = 0; j <= group.length-1 && !clash; j++) {
			appointment2 = group[j];
			if(appointment.id != appointment2.id) {
				if(appointment.Clash(appointment2)) {
					clash = true;
				};
			};
		};

		if(!clash) {
			group.push(appointment);
			return;
		};
	};

	clashGroup.push([appointment]);
};

JAppointments.prototype.PaintAppointments = function() {
	var self = this;
	var clashGroup = [];
	
	this.appointments.each(function(i, appointment) {
		self.GetClashGroup(appointment, clashGroup);
	});
	
	var left = 0;
	for (var i = 0; i <= clashGroup.length-1 ; i++) {
		var group = clashGroup[i];
		for (var j = 0; j <= group.length-1 ; j++) {
			var app = group[j];
			var width = self.ClashOnRight(app, i+1, clashGroup);
			app.left = left;
			app.width = (100 / clashGroup.length * (width+1));
		};
		
		left += (100/clashGroup.length);
	};

	this.appointments.each(function(i, appointment) {
		appointment.Resume();
	});
};

//**************************************************************************************************
// JAppointment
//**************************************************************************************************
Class.Inherits(JAppointment, JControl);
function JAppointment(Params) {
    JAppointment.prototype.parent.call(this, Params);
};
JAppointment.prototype.classID = "JAppointment";

JAppointment.prototype.DefaultPainter = function() {
    return new JAppointmentPainter(this);
};

// JAppointment.prototype.Click = function() {
	// if(this.enabled && this.click) this.click(this);
// }

// JAppointment.prototype.SetEnabled = function(enabled) {
	// this.elementContainer.attr("btn-state", this.enabled = enabled ? "enabled": "disabled")
// };

JAppointment.prototype.Clash = function(a2) {
	var s1 = this.start.getHours() * 60 + this.start.getMinutes();
	var s2 = this.finish.getHours() * 60 + this.finish.getMinutes();
	var f1 = a2.start.getHours() * 60 + a2.start.getMinutes();
	var f2 = a2.finish.getHours() * 60 + a2.finish.getMinutes();

	return (f1 > s1 && f1 < s2) || (f2 > s1 && f2 < s2) || (f1 == s1) || (f2 == s2) || (s1 >= f1 && s2 <= f2);
};

JAppointment.prototype.Initialize = function(params) {
    JAppointment.prototype.parent.prototype.Initialize.call(this, params);
	// alerts(params.id);
    this.id = params.id;
    this.appointments = params.appointments;
    this.start = params.start;
    this.finish = params.finish;
    this.color = params.color;
    // this.enabled = defaultValue(params.enabled, true);
    // this.hint = params.hint;
    // this.click = params.click; 
    this.container = params.container;
	params.DelayPainting = true;
};
