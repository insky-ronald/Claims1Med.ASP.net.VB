
//**************************************************************************************************
// BaseEditControlPainter
//**************************************************************************************************
Class.Inherits(BaseEditControlPainter, JControlPainter);
function BaseEditControlPainter(Control) {
    BaseEditControlPainter.prototype.parent.call(this, Control);
};

BaseEditControlPainter.prototype.type = "edit";
BaseEditControlPainter.prototype.classID = "BaseEditControlPainter";

BaseEditControlPainter.prototype.Readonly = function() {
	return this.Control.dataColumn.readonly || this.Control.dataColumn.dataset.readonly;
};

BaseEditControlPainter.prototype.Paint = function() {
    BaseEditControlPainter.prototype.parent.prototype.Paint.call(this);
	var edit = this.Control;
	var container = CreateElement("tr", edit.container).attr("edit-sec", "edit-row")		;
		
	if(edit.showCategory) {
		var gutter = CreateElement("td", container).attr("cat-sec", "gutter");
		
		/*if(edit.Required()) {
			container.attr("edit-required",  "1");
			desktop.GetSvg(gutter, "star");
		} */
	};
	
	this.label = CreateElement("td", container).attr("edit-sec", "label")
		.html(edit.GetCaption());
	
	this.PaintRow(edit, container);

	this.SetContainer(container);
};

BaseEditControlPainter.prototype.PaintRow = function(edit, container) {
	if(this.Control.showButton && !this.Readonly()) {
		var self = this;
		this.button = CreateElement("td", container).attr("edit-sec", "button").attr("button-type", this.Control.dataColumn.type)
			.click(function() {
				self.Control.ButtonClick($(this));
			});
			
		desktop.GetSvg(this.button, this.Control.buttonIcon)
	} else
		this.label.attr("colspan", 2);
	
	if(edit.Required()) 
		desktop.GetSvg(CreateElement("td", container).attr("edit-sec", "required"), "star")
	else
		CreateElement("td", container).attr("edit-sec", "required");
	
	this.data = CreateElement("td", container).attr("edit-sec", "data");
	
	this.edit = this.CreateEditControl(this.data);
	
	if(this.Readonly()) {
		this.edit.attr("tabindex", "-1");
		this.edit.attr("readonly", "readonly");
	} else {
		// if(!this.Control.editor.tabindex) this.Control.editor.tabindex = 0;
		// this.edit.attr("tabindex", ++this.Control.editor.tabindex);
		this.edit.attr("tabindex", 0);
	}
	
	this.BindEditControl(this.edit);
};

BaseEditControlPainter.prototype.BindEditControl = function(control) {
	this.Control.dataset.bindControl(control, {
		fname: this.Control.id
	}, this.Control.customControl);
	
	if(this.Control.customControl) {
		var self = this;
		control.on("update", function(dataset, column) {
			self.PaintControl($(this));
		})
	};
};

BaseEditControlPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("input", container, "", "");
};

BaseEditControlPainter.prototype.NumericOnly = function(control) {
	control.keydown(function(event) {
		// console.log(event.keyCode)
		// Allow: backspace, delete, escape, and enter
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 27 || event.keyCode == 13 ||
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) ||
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39) ||
			 // Allow: tab
			(event.keyCode == 9)) {
				 // let it happen, don't do anything
				 return;
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				if(!((event.keyCode == 190 || event.keyCode == 110))) {
					// console.log(event.keyCode)
					event.preventDefault();                                 
				}
			}
		}
	});					
};

//**************************************************************************************************
// TextEditPainter
//**************************************************************************************************
Class.Inherits(TextEditPainter, BaseEditControlPainter);
function TextEditPainter(Control) {
    TextEditPainter.prototype.parent.call(this, Control);
};

TextEditPainter.prototype.classID = "TextEditPainter";

TextEditPainter.prototype.BindEditControl = function(control) {
	TextEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	if(this.Control.dataColumn.upperCase) {
		this.edit.css("text-transform", "uppercase");
	};
};

//**************************************************************************************************
// NumericEditPainter
//**************************************************************************************************
Class.Inherits(NumericEditPainter, BaseEditControlPainter);
function NumericEditPainter(Control) {
    NumericEditPainter.prototype.parent.call(this, Control);
};

NumericEditPainter.prototype.classID = "NumericEditPainter";

NumericEditPainter.prototype.BindEditControl = function(control) {
	NumericEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	
	control.keydown(function(event) {
		// Allow: backspace, delete, escape, and enter
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 27 || event.keyCode == 13 ||
			 // Allow: dot or period
			(event.keyCode == 190) || (event.keyCode == 110) ||
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) ||
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39) ||
			 // Allow: tab
			(event.keyCode == 9)) {
				 // let it happen, don't do anything
				 return;
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				// if(!(item.Money && (event.keyCode == 190 || event.keyCode == 110))) {
				if(!((event.keyCode == 190 || event.keyCode == 110))) {
					event.preventDefault();                                 
				}
			}
		}
	});					
};

//**************************************************************************************************
// DateEditPainter
//**************************************************************************************************
Class.Inherits(DateEditPainter, BaseEditControlPainter);
function DateEditPainter(Control) {
    DateEditPainter.prototype.parent.call(this, Control);
};

DateEditPainter.prototype.classID = "DateEditPainter";

DateEditPainter.prototype.BindEditControl = function(control) {
	DateEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	var dateInput = new DateInput(control, this.Control);
	control.data("input", dateInput);
	control.data("edit", this.Control);
	control.data("dataColumn", this.Control.dataColumn);

	control.focus(function() {
		// console.log("input")
		$(this).data("edit").ShowCalendar();
		$(this).select();
		$(this).data("oldValue", $(this).data("dataColumn").raw());
		// console.log("old: " + $(this).data("dataColumn").raw());
	});
	
	// control.on("mousedown", function(event) {
		// if(!$(this).is(":focus")) {
			// event.preventDefault();
		// }
	// });
	
	// control.on("mouseup", function(event) {
		// console.log("mouseup " + $(this).is(":focus"))
	// });
	
	// control.on("click", function(event) {
		// console.log("click")
		// event.preventDefault();
	// });
	
	// control.on("blur", function(event) {
		// $(this).data("edit").HideCalendar();
	// });
	
	control.on("input", function(event) {
		var input = $(this).data("input");
		var item = input.currentItem();
		// var section = input.section();
		
		if(input.val().length == 2 && input.pos().start == input.val().length) {
			var val = input.val();
			if(input.dataColumn.isNull()) {
				input.setDate(Date.today());
			};
			var values = input.values();
			values.month = parseInt(val);
			var complete = input.valid(values);
			if(complete) {
				input.setDate(complete);
				item.next.select();
			} else {
				item.select(true);
			};
		} else {
			var values = input.editingValues();
			// console.log("here")
			if(values[item.name].length == item.max) {
				var complete = input.valid(values);
				if(complete) {
					input.setDate(complete);
					item.next.select();
				} else {
					item.select(true);
				};
			};
			// console.log(item)
			// console.log(values)
		}
	});
	
	control.keydown(function(event) {
		// console.log(event.keyCode);
		var input = $(this).data("input");
		var section = input.section();
		var pos = input.pos();
		
		if(event.keyCode == 27) {
			$(this).data("dataColumn").set($(this).data("oldValue"));
			// console.log("old: " + $(this).data("oldValue"));
			// $(this).data("edit").HideCalendar();
		};
		
		if(event.keyCode == 9) {
			$(this).data("edit").HideCalendar();
		};

		if(event.keyCode == 37 || event.keyCode == 39) { // arrow-left and right
			var input = $(this).data("input");

			input.each(function(section) {
				if(section.start == pos.start && section.end == pos.end) {
					if(event.keyCode == 39)
						section.next.select()
					else
						section.prev.select();
					
					event.preventDefault();
					return;
				}
			});
		};
		
		if(event.keyCode == 38 || event.keyCode == 40) { // arrow-up & down
			$(this).data("edit").ShowCalendar();
			var input = $(this).data("input");
			var item = input.currentItem();
			
			if(item) {
				if(item.name == "apm") {
					var editingValues = input.editingValues();
					// editingValues.apm = editingValues.apm == "AM" ? "PM": "AM";
					item.set(editingValues.apm == "AM" ? "PM": "AM");
					// console.log(")
				} else {
					var increment = event.keyCode == 38 ? 1: -1;
					var values = input.stringDate2(input.values());
					var date = Date.parse(values);
					// console.log(item)
					if(item.name == "year") {
						date.addYears(increment);
					} else if(item.name == "month") {
						date.addMonths(increment);
					} else if(item.name == "day") {
						date.addDays(increment);
					} else if(item.name == "hour") {
						var hours = date.getHours() + increment;
						var apm = input.items.get("apm").value;
						if(hours == 0 && apm == "AM") {
							input.items.get("apm").set("PM");
						} if(hours == 12 && apm == "AM") {
							input.items.get("apm").set("PM");
						} else if(hours == 23 && apm == "PM") {
							input.items.get("apm").set("AM");
						};
						date.setHours(hours);
					} else if(item.name == "hourx") {
						date.addHours(increment);
					} else if(item.name == "minute") {
						date.addMinutes(increment);
					} else if(item.name == "second") {
						date.addSeconds(increment);
					};
					
					input.setDate(date);
				};
				
				// console.log(item)
				item.select();
				event.preventDefault();
				return;
			};
		};
		
		if(event.keyCode == 13) {
			$(this).data("edit").ShowCalendar();
			var input = $(this).data("input");
			if(input.editing) {
				if(pos.start == input.val().length) {
					section.next.select();
				} else {
					var item = input.currentItem();
					var editingValues = input.editingValues();
					item.value = editingValues[item.name];
					var complete = input.valid(editingValues);
					if(complete) {
						item.next.select();
					} else {
						item.select(true);
					};
				};
			} else if(pos.start == 0 && pos.end == $(this).val().length) { // all text is selected
				input.items.getByIndex(0).select();
			} else {
				var item;
				input.each(function(section) {
					if(section.start == pos.start && section.end == pos.end) {
						item = section.next;
					} else if(pos.start >= section.start && pos.start <= section.end) {
						item = section;
					};
				});
				
				if(item) {
					item.select();
				};
			};
			
			input.editing = false;
			event.preventDefault();
			return;
		};
		
		if((event.keyCode == 111 || event.keyCode == 109) && pos.start == input.val().length) { // 111 --> /, 109 --> -
			section.next.select();
			event.preventDefault();
			return;
		};
		
		var keyIndex = 0;
		if(event.keyCode >= 48 && event.keyCode <= 57) {
			keyIndex = event.keyCode - 48 + 1;
		} else if(event.keyCode >= 96 && event.keyCode <= 105) {
			keyIndex = event.keyCode - 96 + 1;
		};
		
		if(keyIndex) {
			var num = [0,1,2,3,4,5,6,7,8,9];
			var key = num[keyIndex - 1];	
			var input = $(this).data("input");
			input.editing = true;
			// return;
			// input.update();
			// event.preventDefault();
			// return;
		}
		
		// Allow: backspace, delete, escape, and enter
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 27 || event.keyCode == 13 ||
			 // Allow: dot or period
			(event.keyCode == 190) || (event.keyCode == 110) ||
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) ||
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39) ||
			 // Allow: tab
			(event.keyCode == 9) ||
			// (event.keyCode == 189) ||
			(event.keyCode == 191)
			) {
				 // let it happen, don't do anything
				 return;
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				// if(!(item.Money && (event.keyCode == 190 || event.keyCode == 110))) {
				if(!((event.keyCode == 190 || event.keyCode == 110))) {
					event.preventDefault();
				}
			}
		}
	});					
};

//**************************************************************************************************
// DateEditExPainter
//**************************************************************************************************
/*
Class.Inherits(DateEditExPainter, BaseEditControlPainter);
function DateEditExPainter(Control) {
    DateEditExPainter.prototype.parent.call(this, Control);
};

DateEditExPainter.prototype.classID = "DateEditExPainter";

DateEditExPainter.prototype.BindEditControl = function(control) {
	DateEditExPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	
	control.on("change", function(dataset, column) {
		// self.PaintControl($(this));
	})
	
	control.on("input", function() {
		// self.PaintControl($(this));
	})
	
	// console.log(control)
	// $(control)[0].pattern = "[0-9]"
	// console.log(control.valueAsDate)
	// console.log($(control)[0].valueAsDate)
	// $(control)[0].valueAsDate = true;
};

DateEditExPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("div", container).attr("edit-sec", "datex")
};

DateEditExPainter.prototype.PaintControl = function(container) {
	// var	value = this.Control.dataColumn.asDate();
	
	container.html("");
	
	var day = new DateInput("dd", CreateElement("span", container), this.Control.dataColumn);
	
		CreateElement("label", container).html("/")
	
	var month = new DateInput("MM", CreateElement("span", container), this.Control.dataColumn);
	
		CreateElement("label", container).html("/")
		
	var year = new DateInput("yyyy", CreateElement("span", container), this.Control.dataColumn);
	
	day.next = month;
	day.prev = year;
	day.dates = {day:day, month:month, year:year};
	
	month.next = year;
	month.prev = day;
	month.dates = {day:day, month:month, year:year};
	
	year.next = day;
	year.prev = month;
	year.dates = {day:day, month:month, year:year};
};
*/

//**************************************************************************************************
// RadioButtonEditPainter
//**************************************************************************************************
Class.Inherits(RadioButtonEditPainter, BaseEditControlPainter);
function RadioButtonEditPainter(Control) {
    RadioButtonEditPainter.prototype.parent.call(this, Control);
};

RadioButtonEditPainter.prototype.classID = "RadioButtonEditPainter";

RadioButtonEditPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("div", container).attr("edit-sec", "radio")
};

RadioButtonEditPainter.prototype.PaintControl = function(container) {
	var edit = this.Control;	
	var column = this.Control.dataColumn;
	container.html("");
	if(this.Readonly()) {
		for(var i = 0; i < edit.data.length; i++) {
			var selected = column.get() == edit.data[i][edit.keyName];
			if(selected) {
				var c = CreateElement("div", container).attr("radio-sec", "item-readonly")
							.data("column", column)
							.data("value", edit.data[i][edit.keyName])
							.click(function() {
								var item = $(this);
								if(item.data("value") != column.get())
									column.set(item.data("value"));
							});
							
				desktop.GetSvg(c, "radio-on");
				
				CreateElement("span", c)
					.attr("radio-sec", "label")
					.attr("radio-selected", selected ? 1: 0)
					.html(edit.data[i][edit.valueName]);
			};
		};
	} else {
		for(var i = 0; i < edit.data.length; i++) {
			var c = CreateElement("div", container).attr("radio-sec", "item")
						.data("column", column)
						.data("value", edit.data[i][edit.keyName])
						.click(function() {
							var item = $(this);
							if(item.data("value") != column.get())
								column.set(item.data("value"));
						});
				
			var selected = column.get() == edit.data[i][edit.keyName];
			if(selected) {
				desktop.GetSvg(c, "radio-on")
			} else {
				desktop.GetSvg(c, "radio-off");
			};
	
			CreateElement("span", c)
				.attr("radio-sec", "label")
				.attr("radio-selected", selected ? 1: 0)
				.html(edit.data[i][edit.valueName]);
		};
	};
};

//**************************************************************************************************
// LinkEditPainter
//**************************************************************************************************
Class.Inherits(LinkEditPainter, BaseEditControlPainter);
function LinkEditPainter(Control) {
    LinkEditPainter.prototype.parent.call(this, Control);
};

LinkEditPainter.prototype.classID = "LinkEditPainter";

LinkEditPainter.prototype.CreateEditControl = function(container) {
	// return CreateElement("div", container).attr("edit-sec", "radio")
	return CreateElement("a", container).attr("edit-sec", "link")
};

LinkEditPainter.prototype.PaintControl = function(container) {
	var edit = this.Control;	
	var column = this.Control.dataColumn;
	container.html(column.get());
	container.attr("href", edit.link(column));
	container.attr("target", "_blank");
};

//**************************************************************************************************
// ContainerEditPainter
//**************************************************************************************************
Class.Inherits(ContainerEditPainter, BaseEditControlPainter);
function ContainerEditPainter(Control) {
    ContainerEditPainter.prototype.parent.call(this, Control);
};

ContainerEditPainter.prototype.classID = "ContainerEditPainter";

//**************************************************************************************************
// LookupEditPainter
//**************************************************************************************************
Class.Inherits(LookupEditPainter, ContainerEditPainter);
function LookupEditPainter(Control) {
    LookupEditPainter.prototype.parent.call(this, Control);
};

LookupEditPainter.prototype.classID = "LookupEditPainter";

LookupEditPainter.prototype.BindEditControl = function(control) {
	LookupEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	if(this.Control.disableEdit) {
		control.attr("readonly", "readonly")
	};
};

//**************************************************************************************************
// ListBoxEditPainter
//**************************************************************************************************
Class.Inherits(ListBoxEditPainter, ContainerEditPainter);
function ListBoxEditPainter(Control) {
    ListBoxEditPainter.prototype.parent.call(this, Control);
};

ListBoxEditPainter.prototype.classID = "ListBoxEditPainter";

ListBoxEditPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("div", container).attr("edit-sec", "listbox")
};

ListBoxEditPainter.prototype.PaintControl = function(container) {
	var edit = this.Control;	
	var column = this.Control.dataColumn;	
	for(var i = 0; i < edit.data.length; i++) {
		var selected = column.get() == edit.data[i][edit.keyName];
		if(selected) {
			container.html(edit.data[i][edit.valueName]);
		};
	};
};
