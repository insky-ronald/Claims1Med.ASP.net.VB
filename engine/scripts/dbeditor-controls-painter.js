
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
	// return this.Control.dataColumn.readonly || this.Control.dataColumn.dataset.readonly;
	return this.Control.Readonly();
};

BaseEditControlPainter.prototype.Paint = function() {
    BaseEditControlPainter.prototype.parent.prototype.Paint.call(this);
	var edit = this.Control;
	var container = this.rowContainer = CreateElement("tr", edit.container).attr("edit-sec", "edit-row");
	
	if(edit.showCategory) {
		var gutter = CreateElement("td", container).attr("cat-sec", "gutter");
		container.data("gutter", gutter);
	};
	
	if(!this.Control.noLabel) 
		this.label = CreateElement("td", container).attr("edit-sec", "label")
			.html(edit.GetCaption());
	
	this.PaintRow(edit, container);

	this.SetContainer(container);
};

BaseEditControlPainter.prototype.PaintRow = function(edit, container) {
	// console.log(this.Control)
	if(this.Control.noLabel) {
		// console.log(this.label);
		// this.label.attr("colspan", 2);
	} else if(this.Control.showButton && !this.Readonly()) {
		var self = this;
		this.button = CreateElement("td", container).attr("edit-sec", "button").attr("button-type", this.Control.dataColumn.type)
			.click(function() {
				self.Control.ButtonClick($(this));
			});
			
		desktop.GetSvg(this.button, this.Control.buttonIcon)
	} else
		this.label.attr("colspan", 2);
	
	if(!this.Control.noLabel) 
		CreateElement("td", container).attr("edit-sec", "sizer");
	
	if(!this.Control.noLabel) {
		if(edit.Required()) {
			var gutter = container.data("gutter");
			desktop.GetSvg(gutter, "db-required");
			// desktop.GetSvg(CreateElement("td", container).attr("edit-sec", "required"), "star")
		// } else {
			// CreateElement("td", container).attr("edit-sec", "required");
		}
	};
	
	this.data = CreateElement("td", container).attr("edit-sec", "data");
	if(this.Control.noLabel) {
		this.data.attr("colspan", 4);
		// console.log(this.Control)
		if(!this.Control.noLabelPadding)
			this.data.css("padding-left", 10);
	};
	
	this.edit = this.CreateEditControl(this.data);
	
	this.SetReadOnly(this.Readonly());
	this.SetVisible(this.Control.visible);
	
	this.BindEditControl(this.edit);
};

BaseEditControlPainter.prototype.SetVisible = function(visible) {
	this.rowContainer.css("display", visible ? "" : "none")	
};

BaseEditControlPainter.prototype.SetRequired = function(required) {
	if(!this.Control.noLabel) {
		if(required) {
			if(!this.Control.dataColumn.required)
				desktop.GetSvg(this.container.data("gutter"), "db-required");
		} else {
			this.container.data("gutter").html("");
		};
		
		this.Control.dataColumn.required = required;
	}
};

BaseEditControlPainter.prototype.SetReadOnly = function(readonly) {
	if(readonly) {
		this.edit.attr("tabindex", "-1");
		this.edit.attr("readonly", "readonly");
	} else if(this.Control.acceptTab) {
		// if(!this.Control.editor.tabindex) this.Control.editor.tabindex = 0;
		// this.edit.attr("tabindex", ++this.Control.editor.tabindex);
		this.edit.removeAttr("readonly");
		if(!this.Control.noFocus)
			this.edit.attr("tabindex", 0);
	}
}

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
// MemoEditPainter
//**************************************************************************************************
Class.Inherits(MemoEditPainter, BaseEditControlPainter);
function MemoEditPainter(Control) {
    MemoEditPainter.prototype.parent.call(this, Control);
};

MemoEditPainter.prototype.classID = "MemoEditPainter";

MemoEditPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("textarea", container, "", "").css("padding", "2px 0 0 0").css("height", this.Control.height);
};

MemoEditPainter.prototype.BindEditControl = function(control) {
	MemoEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	// if(this.Control.dataColumn.upperCase) {
		// this.edit.css("text-transform", "uppercase");
	// };
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
// MoneyEditPainter
//**************************************************************************************************
Class.Inherits(MoneyEditPainter, NumericEditPainter);
function MoneyEditPainter(Control) {
    MoneyEditPainter.prototype.parent.call(this, Control);
};

MoneyEditPainter.prototype.classID = "MoneyEditPainter";

MoneyEditPainter.prototype.BindEditControl = function(control) {
	MoneyEditPainter.prototype.parent.prototype.BindEditControl.call(this, control);
	
	control.data("edit", this.Control);
	
	control.focus(function() {
		var val = $(this).val();
		$(this).val(val.replaceAll(",",""));
		$(this).select();
	});
	
	control.on("blur", function(event) {
		if($(this).val()) {
			var s = $(this).val().replaceAll(",","");
			if(s.indexOf(".") == -1) s += ".0";			
			var val = parseFloat(s);
			if(Object.prototype.toString.call(val) === "[object Number]") {
				$(this).val(val.formatMoney($(this).data("edit").dataColumn.format))
			};
		} else { 
			$(this).val("");
		}
	});
	
	control.keydown(function(event) {
		var val = $(this).val();
		if(event.keyCode == 13) {
			if(val) {
				if(val == ".") val = "0";
				$(this).val(parseFloat(val).formatMoney($(this).data("edit").dataColumn.format).replaceAll(",",""))
				$(this).select();
			};
		};
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
	
	var dateInput = new JDateInput({input:control, editor:this.Control});
	control.data("dateInput", dateInput);
	control.data("edit", this.Control);
	// control.data("dataColumn", this.Control.dataColumn);

	// control.focus(function() {
		// $(this).data("edit").ShowCalendar();
		// $(this).select();
	// });
	
	// control.keydown(function(event) {
		// if(event.keyCode == 9) {
			// $(this).data("edit").HideCalendar();
		// };
	// });
};

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
	// container.attr("target", edit.link(column));
};

//**************************************************************************************************
// TimeStampPainter
//**************************************************************************************************
Class.Inherits(TimeStampPainter, BaseEditControlPainter);
function TimeStampPainter(Control) {
    TimeStampPainter.prototype.parent.call(this, Control);
};

TimeStampPainter.prototype.classID = "TimeStampPainter";

TimeStampPainter.prototype.CreateEditControl = function(container) {
	// return CreateElement("div", container).attr("edit-sec", "radio")
	// return CreateElement("a", container).attr("edit-sec", "link")
	return CreateElement("label", container).attr("edit-sec", "timestamp")
};

TimeStampPainter.prototype.PaintControl = function(container) {
	var edit = this.Control;
	// var name = this.Control
	// console.log(this.Control.name)
	var column = this.Control.dataColumn;
	var name = this.Control.dataColumn.dataset.get(this.Control.name);
	// console.log(this.Control.name)
	// return ("Created by <span x-sec='user'>{1}</span> on <span x-sec='date'>{0}</span>").format(column.formatDateTime("MMMM d, yyyy"), column.dataset.get("create_user_name"));
	
	container.html(("{0} <span x-sec='user'>{1}</span> on <span x-sec='datetime'>{2}</span>").format(this.Control.label, name, column.formatDateTime("MMMM d, yyyy"));
	// container.attr("href", edit.link(column));
	// container.attr("target", "_blank");
};

//**************************************************************************************************
// ContainerEditPainter
//**************************************************************************************************
Class.Inherits(ContainerEditPainter, BaseEditControlPainter);
function ContainerEditPainter(Control) {
    ContainerEditPainter.prototype.parent.call(this, Control);
};

ContainerEditPainter.prototype.classID = "ContainerEditPainter";

ContainerEditPainter.prototype.CreateEditControl = function(container) {
	return CreateElement("div", container).css("height", this.Control.height)
};

ContainerEditPainter.prototype.BindEditControl = function(control) {
	this.Control.initContent($(control));
	// console.log("BindEditControl")
	// this.Control.dataset.bindControl(control, {
		// fname: this.Control.id
	// }, this.Control.customControl);
	
	// if(this.Control.customControl) {
		// var self = this;
		// control.on("update", function(dataset, column) {
			// self.PaintControl($(this));
		// })
	// };
};

//**************************************************************************************************
// CustomDropDownEditPainter
//**************************************************************************************************
Class.Inherits(CustomDropDownEditPainter, BaseEditControlPainter);
function CustomDropDownEditPainter(Control) {
    CustomDropDownEditPainter.prototype.parent.call(this, Control);
};

CustomDropDownEditPainter.prototype.classID = "CustomDropDownEditPainter";

//**************************************************************************************************
// LookupEditPainter
//**************************************************************************************************
Class.Inherits(LookupEditPainter, CustomDropDownEditPainter);
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
Class.Inherits(ListBoxEditPainter, CustomDropDownEditPainter);
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
