// ****************************************************************************************************
// Last modified on
// 14-SEP-2014 ihms.0.0.0.1
// 19-OCT-2014 ihms.0.0.1.1
// ****************************************************************************************************
// ****************************************************************************************************
//**************************************************************************************************
// JDatePickerPainter
// The default painter used by JDatePicker
//**************************************************************************************************
Class.Inherits(JDatePickerPainter, JBasePainter);
function JDatePickerPainter(Control) {
    JDatePickerPainter.prototype.parent.call(this, Control);
};

JDatePickerPainter.prototype.classID = "JDatePickerPainter";

JDatePickerPainter.prototype.Paint = function() {
    JDatePickerPainter.prototype.parent.prototype.Paint.call(this);
	
	var __weeknames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday"
	];
	
    var self = this;
	var css = defaultValue(this.Control.options.css, "default");
    var container = CreateElement("div", this.Control.container, "", css + "-datepicker")
    	.attr("control-type", "datepicker")
    	
	this.header = CreateElement("div", container).attr("dp-section", "header");

	this.PaintHeader();
    	
    var table = CreateElement("table", container, "", css + "-datepicker-calendar")
        .attr("cellspacing", 0)
        .attr("cellpadding", 0)
        .attr("border", 0)
        .click(function(e) {
        	self.Control.Select($(e.target).data("date"));
			// self.preventDefault();
			// alerts("OK");
        });

    var h = $("<thead>");
    table.append(h)
    var r = $("<tr>");
	for(var i=0;i<7;i++) {
		r.append($("<th>").html(__weeknames[i].substring(0,3))
	};
    h.append(r);   

    this.calendar = $("<thead>");
    table.append(this.calendar);  
    this.PaintCalendar() ;
    	
	var footer = CreateElement("div", container)
    	.attr("dp-section", "footer");

	CreateElement("div", footer, "", "button")
		.attr("btn-state", "enabled")
		.attr("btn-color", "green")
		.html("Today")
		// .html(Date.today().getWeek())
		.click(function() {
			// self.Control.Select(new Date());
			self.Control.Select(Date.today());
		});

	if(defaultValue(this.Control.options.showClear, true))
		CreateElement("div", footer, "", "button")
			.attr("btn-state", "enabled")
			.attr("btn-color", "green")
			.html("Clear")
			.click(function() {
				self.Control.Clear();
			});
};

JDatePickerPainter.prototype.prevMonth = function() {    
	this.Control.selected.addMonths(-1);
	this.PaintCalendar();
};

JDatePickerPainter.prototype.nextMonth = function() {
//    var date = new Date(this.Control.selected);
//    var d = date.getDate();
//    alerts(d, date.daysInMonth(), date, this.Control.selected);
	this.Control.selected.addMonths(1);
	this.PaintCalendar();
};

JDatePickerPainter.prototype.PaintHeader = function() {
    	
    var table = CreateElement("table", this.header)
        .attr("cellspacing", 0)
        .attr("cellpadding", 0)
        .attr("border", 0)
        .append($("<thead>"));

    var self = this;
    $("<tr>").appendTo(table.find("thead")).each(function() {
    
	    desktop.GetSvg($("<td>").appendTo($(this)).attr("dp-btn", "prev").click(function() {    	
	    	self.prevMonth();
	    }), "arrow-left");
	    
	    self.Title = $("<td>").appendTo($(this)).attr("dp-title", "");
	    
	    desktop.GetSvg($("<td>").appendTo($(this)).attr("dp-btn", "next").click(function() {
	    	self.nextMonth();
	    }), "arrow-right");
	    
    });
    
};

JDatePickerPainter.prototype.PaintCalendar = function() {
	this.Title.html(this.Control.selected.format("d MMM yyyy"));
//	this.Title.html(("{0} {1}").format(__monthnames[this.Control.selected.getMonth()],this.Control.selected.getFullYear()));

	this.calendar.html("");
	
	var today = new Date();
	var date = new Date(this.Control.selected);
	date = new Date(date.setDate(1));
	
	var month = date.getMonth();
	var day = date.getDay();
	
	if(day > 0) {
		date = date.addDays(-day);
	};

    var dates = [];
	for(var i=0;i<42;i++) {
		dates.push(new Date(date));
		date = date.addDays(1);
	};
	
	var ctr = 0;
	for(var i=0;i<6;i++) {
    	var r = $("<tr>");
		for(var c=0;c<7;c++) {
			var cell = $("<td>");
			var d = dates[ctr++];
			
	    	r.append(cell.html(d.getDate());
	    	if(d.getMonth() != month) {
	    		cell.attr("dt", "xx");
	    	} else if(d.getDay() == 0 || d.getDay() == 6) {
	    		cell.attr("dt", "wk");
	    	} else {
	    		cell.attr("dt", "nm");
	    	};
	    	
	    	if(d.sameDay(today)) {
	    		cell.attr("today", "");
	    	};
	    	if(d.sameDay(this.Control.date)) {
	    		cell.attr("current", "");
	    	};
	    	
	    	cell.data("date", d);
		};    	
    	this.calendar.append(r);
	};
};