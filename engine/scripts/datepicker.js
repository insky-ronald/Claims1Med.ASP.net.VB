// ****************************************************************************************************
// Last modified on
// 19-OCT-2014 ihms.0.0.1.1
// ****************************************************************************************************
function ShowDatePicker(options) {
	ShowPopup({
	    Page: options.page,
	    Target: options.target,
	    Color: "#AAAAAA",
	  	Modal: false,
	    Painter: {
	        painterClass: PopupFixedSizePainter,
			width: "auto",
			height: "auto",
            css: "system",
	        OnRenderContent: function(dialog, container) {
				new JDatePicker({
					container: container,
					target: options.target,
					date: options.date,
					options:{
            			css: "default",
					},
					init:function(datepicker){
					},
					update:function(datepicker, date) {
						if(options.update) {
							options.update(date);
						};
						
						dialog.Hide();
					}
				});				
			}	        
		});	
};

//**************************************************************************************************
// JDatePicker
//**************************************************************************************************
Class.Inherits(JDatePicker, JControl);

function JDatePicker(Params) {
    JDatePicker.prototype.parent.call(this, Params);
};

JDatePicker.prototype.classID = "JDatePicker";

JDatePicker.prototype.Initialize = function(Params) {
    JDatePicker.prototype.parent.prototype.Initialize.call(this, Params);
    this.container = Params.container;
    this.options = Params.options;
    this.init = Params.init;
    this.update = Params.update;
    this.date;
    this.selected;
    if(Params.date) {
	    this.date = new Date(Params.date);
	    this.selected = new Date(Params.date);
    } else {
	    this.date = new Date();
	    this.selected = new Date();
    };
	
	if(this.init) {
		this.init(this);
	}
};

JDatePicker.prototype.DefaultPainter = function() {
    return new JDatePickerPainter(this);
};

JDatePicker.prototype.Clear = function() {
	if(this.update) {
		// this.update(this, undefined);
		this.update(this, null);
	};
}

JDatePicker.prototype.Refresh = function(newDate) {
	this.date = new Date(newDate);
	this.selected = new Date(newDate);
	this.Painter.PaintCalendar();
};

JDatePicker.prototype.Select = function(date, dontClose) {
	if(this.update) {
		this.update(this, date, dontClose);
	};
}