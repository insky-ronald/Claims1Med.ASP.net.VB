// ****************************************************************************************************
// File name: form-edit.js
// Last modified on
// 13-MAR-2015
// ****************************************************************************************************

//**************************************************************************************************
// JDateInput
// 01 02 03   04 15 06 07
// dd/MM/yyyy hh:mm:ss tt
//**************************************************************************************************
Class.Inherits(JDateInput, JObject);
function JDateInput(params) {
	JDateInput.prototype.parent.call(this, params);
};

JDateInput.prototype.classID = "JDateInput";

JDateInput.prototype.initialize = function(params) {
	JDateInput.prototype.parent.prototype.initialize.call(this, params);
	this.input = params.input;
	this.editor = params.editor;
	this.dataColumn = this.editor.dataColumn;
	this.items = new JList();
	this.hasTime = this.dataColumn.format == "datetime";
	this.editing = false;
	
	var sections = [];
	var tokens = ["yyyy","MM","dd","hh","mm","ss","tt"];
	for(var i = 0; i < tokens.length; i++) {
		var format = __dateformat;
		if(this.hasTime)
			format = __dateformat +" "+ __timeformat;
		
		var pos = format.indexOf(tokens[i]);
		if(pos > -1) {
			sections.push({
				sec:tokens[i], 
				start:pos,
				end:pos+tokens[i].length
			})
		};
	};
	
	sections.sort(function(a, b) {
		return a.start > b.start;
	});

	for(var i = 0; i < sections.length; i++) {
		var inputClass, section = sections[i];
		section.seq = i+1;
		
		if(section.sec == "dd") {
			inputClass = JDateSectionDay;
		} else if(section.sec == "MM") {
			inputClass = JDateSectionMonth;
		} else if(section.sec == "yyyy") {
			inputClass = JDateSectionYear;
		} else if(section.sec == "hh") {
			inputClass = JDateSectionHour;
		} else if(section.sec == "mm") {
			inputClass = JDateSectionMinute;
		} else if(section.sec == "ss") {
			inputClass = JDateSectionSecond;
		} else if(section.sec == "tt") {
			inputClass = JDateSectionApm;
		};

		var item = this.createInput(inputClass, section);
		this.items.add(item.name, item);
	};
	
	this.items.each(function(i, section, sections) {
		if(i == 0) {
			sections[i].next = sections[i+1];
			sections[i].prev = sections[sections.length-1];
		} else if(i == sections.length-1) {
			sections[i].next = sections[0];
			sections[i].prev = sections[i-1];
		} else {
			sections[i].next = sections[i+1];
			sections[i].prev = sections[i-1];
		}
	});
	
};
	
JDateInput.prototype.setDate = function(date) {		
	if(this.hasTime)
		this.input.val(date.format(__datetimeformat))
	else
		this.input.val(date.format(__dateformat));

	this.editor.calendar.calendar.Select(date, true);
	this.dataColumn.set(date);
};

JDateInput.prototype.update = function(values) {	
	var date = this.valid(values);
	if(!date) 
		date = this.dataColumn.asDate();
	// console.log(date)
	if(this.hasTime)
		this.input.val(date.format(__datetimeformat))
	else
		this.input.val(date.format(__dateformat));
	
	return date;
};

JDateInput.prototype.valid = function(values) {	
	if(!values) {
		values = this.editingValues();
	};
	
	values.year = parseInt(values.year);
	values.month = parseInt(values.month);
	values.day = parseInt(values.day);
	if(this.hasTime) {
		values.hour = parseInt(values.hour);
		values.minute = parseInt(values.minute);
		values.second = parseInt(values.second);
		return ("{0}-{1}-{2} {3}:{4}:{5} {6}").format(values.year.strZero(4), values.month.strZero(2), values.day.strZero(2), values.hour.strZero(2), values.minute.strZero(2), values.second.strZero(2), values.apm).parseDate("yyyy-MM-dd hh:mm:ss tt")
		// return ("{0}-{1}-{2} {3}:{4}:{5} {6}").format(values.year, values.month, values.day, values.hour, values.minute, values.second, values.apm).parseDate("yyyy-M-d h:m:s tt")
	} else {
		return ("{0}-{1}-{2}").format(values.year, values.month, values.day).parseDate("yyyy-M-d");
	};
};

JDateInput.prototype.afterInitialize = function(params) {
	JDateInput.prototype.parent.prototype.afterInitialize.call(this, params);

	this.input.focus(function() {
		$(this).data("edit").ShowCalendar();
		$(this).select();
	});
	
	this.input.keydown(function(event) {
		var dateInput = $(this).data("dateInput");
		if(event.keyCode == 9) {
			$(this).data("edit").HideCalendar();
			// var date = dateInput.update();
			// dateInput.dataColumn.set(date);
			dateInput.dataColumn.set(dateInput.update());
		};
	});

	this.input.on("input", function(event) {
		var dateInput = $(this).data("dateInput");
		var item = dateInput.currentItem();
		if(item) 
			// if(!item.validateInput())
				// console.log({v:dateInput.input.val(), max:item.max})
			// if(!dateInput.validateInput(item))
			// if(!dateInput.valid())
				// item.select()
			// else 
			if(dateInput.editingValues()[item.name].length == item.max) {
				dateInput.update();
				item.next.select();
				dateInput.updateCalendar();
			};
		// console.log(dateInput.editingValues())
		// if(dateInput.editing) {
		// };
	});
	
	this.input.keydown(function(event) {
		// console.log(event.keyCode);
		var dateInput = $(this).data("dateInput");
		var pos = dateInput.pos();
		
		if(event.keyCode == 37 || event.keyCode == 39) { // arrow-left and right
			dateInput.each(function(section) {
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
			var item = dateInput.currentItem();
			var increment = event.keyCode == 38 ? 1: -1;
			if(item) {
				item.toggle(increment);
				// if(item.name == "apm") {
					// var values = dateInput.editingValues();
					// values.apm = values.apm == "AM" ? "PM": "AM";
					// dateInput.update(values);
				// } else {
				// };
				
				item.select();
				event.preventDefault();
				return;				
			};
		};
		
		if(event.keyCode == 13) {
			$(this).data("edit").ShowCalendar();
			// var input = $(this).data("dateInput");
			if(dateInput.editing) {
				var item = dateInput.currentItem();
				dateInput.update();
				// console.log(item)
				item.next.select();
				dateInput.updateCalendar();
				// if(pos.start == input.val().length) {
					// section.next.select();
				// } else {
					// var item = input.currentItem();
					// var editingValues = input.editingValues();
					// item.value = editingValues[item.name];
					// var complete = input.valid(editingValues);
					// if(complete) {
						// item.next.select();
					// } else {
						// item.select(true);
					// };
				// };
			} else if(pos.start == 0 && pos.end == dateInput.input.val().length) { // all text is selected
				dateInput.items.getByIndex(0).select();
			} else {
				var item;
				dateInput.each(function(section) {
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
			
			dateInput.editing = false;
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
			var item = dateInput.currentItem();
			// var input = $(this).data("input");
			// console.log(dateInput.validateKey(item))
			// if(item.validateKey()) {
			if(dateInput.validateKey(item, key)) {
				dateInput.editing = true;
			} else {
				event.preventDefault();
				return;
			}
			// return;
			// input.update();
			// event.preventDefault();
			// return;
		// } else {
			// event.preventDefault();
			// return;
		};
		
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

JDateInput.prototype.createInput = function(inputClass, settings) {
	return new inputClass({owner:this, settings:settings});
};

JDateInput.prototype.currentItem = function() {
	var pos = this.pos();
	var item;
	this.each(function(section) {
		if(section.start == pos.start && section.end == pos.end) {
			item = section;
		} else if(pos.start >= section.start && pos.start <= section.end) {
			item = section;
		};
	});
	
	return item;
};

JDateInput.prototype.pos = function() {
	return {
		start: this.input[0].selectionStart,
		end: this.input[0].selectionEnd
	};
};

JDateInput.prototype.each = function(callback) {
	this.items.each(function(i, section, sections) {
		callback(section);
	});
};

JDateInput.prototype.editingValues = function(value) {
	var editValues;
	
	if(this.hasTime) {
		// console.log(this.input.val())
		var parts;
		
		if(value)
			parts = value.split(" ")
		else
			parts = this.input.val().split(" ");
		
		if(parts.length > 0) {
			editValues = parts[0].split("/").concat(parts[1].split(":"));
			editValues.push(parts[2]);
		} else {
			parts = this.input.val().split(" ");
		}
	} else {
		if(value)
			editValues = value.split("/");
		else
			editValues = this.input.val().split("/");
	};
	
	var values = {};
	this.items.each(function(i, section, sections) {
		values[section.name] = editValues[section.seq-1];
	});
	// console.log(editValues)
	// console.log(values)

	return values;
};

JDateInput.prototype.validateInput = function(item) {
	var values = this.editingValues();
	return item.validateInput(values[item.name]);
};

JDateInput.prototype.validateKey = function(item, key) {
	var allow = true;
	var pos = this.pos()
	var values = this.editingValues();
	// console.log(values)
	var edit = this.input.val();
	// console.log({edit:edit, start:pos.start, end:pos.end})
	// console.log({edit:edit, key:key, left:edit.substring(0, pos.start), right:edit.substring(pos.end)});
	var newEdit = edit.substring(0, pos.start) + key + edit.substring(pos.end);
	// console.log({newEdit:newEdit});
	var newValues = this.editingValues(newEdit);
	// console.log(newEdit)
	// console.log(newValues)
	
	allow = item.validate1(newValues[item.name]);
	if(allow) {
		if(this.hasTime)
			allow = Date.parse(newEdit, __datetimeformat)
		else
			allow = Date.parse(newEdit, __dateformat)
	};
	// console.log(allow)
	
	if(!allow) {
		allow = item.validate2(newValues[item.name]);

	// console.log(allow)
	// console.log(allow)
		// console.log(newValues)
	};
	
	return allow;
	// return item.validateKey(values[item.name]);
};

JDateInput.prototype.updateCalendar = function() {
	// var values = this.editingValues();
	this.editor.calendar.calendar.Select(this.valid(), true);
	
};

//**************************************************************************************************
// JBaseDateSectionInput
//**************************************************************************************************
Class.Inherits(JBaseDateSectionInput, JObject);
function JBaseDateSectionInput(params) {
	JBaseDateSectionInput.prototype.parent.call(this, params);
};

JBaseDateSectionInput.prototype.classID = "JBaseDateSectionInput";

JBaseDateSectionInput.prototype.initialize = function(params) {
	JBaseDateSectionInput.prototype.parent.prototype.initialize.call(this, params);
	this.owner = params.owner;
	this.dataColumn = params.owner.dataColumn;
	this.start = params.settings.start;
	this.end = params.settings.end;
	this.seq = params.settings.seq;
	this.max = this.sec.length;
};

JBaseDateSectionInput.prototype.afterInitialize = function(params) {
	JBaseDateSectionInput.prototype.parent.prototype.afterInitialize.call(this, params);
	// console.log({a:"afterInitialize", o:this})
};

JBaseDateSectionInput.prototype.select = function() {
	this.owner.input[0].selectionStart = this.start;
	this.owner.input[0].selectionEnd = this.end;
	
	return this;
};

JBaseDateSectionInput.prototype.toggle = function(increment) {
};

// JBaseDateSectionInput.prototype.validateInput = function() {
	// return this.owner.valid();
// };

// JBaseDateSectionInput.prototype.validateInput = function() {
	// var values = this.owner.editingValues();
	// return this.validate(values[this.name]);
// };

// JBaseDateSectionInput.prototype.validateInput = function(value) {
	// return false
// };

JBaseDateSectionInput.prototype.validate1 = function(value) {
	return false
};

JBaseDateSectionInput.prototype.validate2 = function(value) {
	return false
};

//**************************************************************************************************
// JDateSectionMonth
//**************************************************************************************************
Class.Inherits(JDateSectionMonth, JBaseDateSectionInput);
function JDateSectionMonth(params) {
	JDateSectionMonth.prototype.parent.call(this, params);
};

JDateSectionMonth.prototype.classID = "JDateSectionMonth";
JDateSectionMonth.prototype.sec = "MM";
JDateSectionMonth.prototype.name = "month";

// JDateSectionMonth.prototype.initialize = function(params) {
	// JDateSectionMonth.prototype.parent.prototype.initialize.call(this, params);
	// if(this.dataColumn.isNull())
		// this.value = ""	
	// else
		// this.value = (this.dataColumn.asDate().getMonth()+1).strZero(2);
// };

JDateSectionMonth.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addMonths(increment));
		// this.owner.editor.calendar.calendar.Select(date, true);
	};
};

JDateSectionMonth.prototype.validate1 = function(value) {
	return (parseInt(value) <= 12 && parseInt(value) > 0)
};

JDateSectionMonth.prototype.validate2 = function(value) {
	// console.log(value)
	// return (value.length == 1 && value == "0")
	return value == "0"
};

// JDateSectionMonth.prototype.validateInput = function(value) {
	// var num = parseInt(value);
	// return (num <= 12 && num > 0) || (num == 0 && value.length == 1)
// };

// JDateSectionMonth.prototype.validateKey = function(value) {
	// var pos = this.owner.pos();
	// var allow = value.length < 2;
	// console.log({value:value, allow:allow})
	// if(!allow)
		// allow = pos.start == this.start && pos.end == this.end;
	// return allow;
// };

//**************************************************************************************************
// JDateSectionDay
//**************************************************************************************************
Class.Inherits(JDateSectionDay, JBaseDateSectionInput);
function JDateSectionDay(params) {
	JDateSectionDay.prototype.parent.call(this, params);
};

JDateSectionDay.prototype.classID = "JDateSectionDay";
JDateSectionDay.prototype.sec = "dd";
JDateSectionDay.prototype.name = "day";

// JDateSectionDay.prototype.initialize = function(params) {
	// JDateSectionDay.prototype.parent.prototype.initialize.call(this, params);
	// if(this.dataColumn.isNull())
		// this.value = ""	
	// else
		// this.value = this.dataColumn.asDate().getDate().strZero(2);
// };

JDateSectionDay.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addDays(increment));
		// this.owner.editor.calendar.calendar.Select(date, true);
	};
};

JDateSectionDay.prototype.validate1 = function(value) {
	// return (parseInt(value) <= 12 && parseInt(value) > 0)
	// return (parseInt(value) <= 31 && parseInt(value) > 0)
	return parseInt(value) > 0
};

JDateSectionDay.prototype.validate2 = function(value) {
	return (value.length == 1 && value == "0")
};

//**************************************************************************************************
// JDateSectionYear
//**************************************************************************************************
Class.Inherits(JDateSectionYear, JBaseDateSectionInput);
function JDateSectionYear(params) {
	JDateSectionYear.prototype.parent.call(this, params);
};

JDateSectionYear.prototype.classID = "JDateSectionYear";
JDateSectionYear.prototype.sec = "yyyy";
JDateSectionYear.prototype.name = "year";

JDateSectionYear.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addYears(increment));
	};
};

JDateSectionYear.prototype.validate1 = function(value) {
	return parseInt(value) > 0
};

JDateSectionYear.prototype.validate2 = function(value) {
	return (value.length <= 4);// && value == "0")
};

//**************************************************************************************************
// JDateSectionHour
//**************************************************************************************************
Class.Inherits(JDateSectionHour, JBaseDateSectionInput);
function JDateSectionHour(params) {
	JDateSectionHour.prototype.parent.call(this, params);
};

JDateSectionHour.prototype.classID = "JDateSectionHour";
JDateSectionHour.prototype.sec = "hh";
JDateSectionHour.prototype.name = "hour";

JDateSectionHour.prototype.validate1 = function(value) {
	return parseInt(value) > 0 && parseInt(value) <= 12;
};

JDateSectionHour.prototype.validate2 = function(value) {
	return (value.length == 1 && value == "0")
};

JDateSectionHour.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addHours(increment));
	};
};

//**************************************************************************************************
// JDateSectionMinute
//**************************************************************************************************
Class.Inherits(JDateSectionMinute, JBaseDateSectionInput);
function JDateSectionMinute(params) {
	JDateSectionMinute.prototype.parent.call(this, params);
};

JDateSectionMinute.prototype.classID = "JDateSectionMinute";
JDateSectionMinute.prototype.sec = "mm";
JDateSectionMinute.prototype.name = "minute";

JDateSectionMinute.prototype.validate1 = function(value) {
	return parseInt(value) <= 59;
};

// JDateSectionMinute.prototype.validate2 = function(value) {
	// return (value.length == 1 && value == "0")
// };

JDateSectionMinute.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addMinutes(increment));
	};
};

//**************************************************************************************************
// JDateSectionSecond
//**************************************************************************************************
Class.Inherits(JDateSectionSecond, JBaseDateSectionInput);
function JDateSectionSecond(params) {
	JDateSectionSecond.prototype.parent.call(this, params);
};

JDateSectionSecond.prototype.classID = "JDateSectionSecond";
JDateSectionSecond.prototype.sec = "ss";
JDateSectionSecond.prototype.name = "second";

JDateSectionSecond.prototype.validate1 = function(value) {
	return parseInt(value) <= 59;
};

// JDateSectionSecond.prototype.validate2 = function(value) {
	// return (value.length == 1 && value == "0")
// };

JDateSectionSecond.prototype.toggle = function(increment) {
	var date = this.owner.valid();
	if(date) {
		this.owner.setDate(date.addSeconds(increment));
	};
};

//**************************************************************************************************
// JDateSectionApm
//**************************************************************************************************
Class.Inherits(JDateSectionApm, JBaseDateSectionInput);
function JDateSectionApm(params) {
	JDateSectionApm.prototype.parent.call(this, params);
};

JDateSectionApm.prototype.classID = "JDateSectionApm";
JDateSectionApm.prototype.sec = "tt";
JDateSectionApm.prototype.name = "apm";

JDateSectionApm.prototype.initialize = function(params) {
	JDateSectionApm.prototype.parent.prototype.initialize.call(this, params);
	if(this.dataColumn.isNull())
		this.value = ""	
	else
		this.value = this.dataColumn.asDate().getHours() < 12 ? "AM" : "PM"; 
};

JDateSectionApm.prototype.toggle = function(increment) {
	var values = this.owner.editingValues();
	values.apm = values.apm == "AM" ? "PM": "AM";
	this.owner.update(values);
};

//==================================================================================================
// SimpleEditor
//==================================================================================================
function SimpleEditor(params) {
	var editor = new JEditor({
		ID: params.id,
		Container: params.container,
		Theme: params.theme,
		Css: "editor",
		LabelWidth: params.labelWidth
	});	      
	
	params.initData(editor, editor.Dataset = params.dataset);
	params.initEditor(editor);
	
	editor.Paint();
	editor.AfterPaint();
	editor.Dataset.updateControls();
};

SimpleEditor.prototype.classID = "SimpleEditor";

//==================================================================================================
// FormEditor
//==================================================================================================
Class.Inherits(FormEditor, JControl);
function FormEditor(params) {
	FormEditor.prototype.parent.call(this, params);
	// console.log("FormEditor")
};

FormEditor.prototype.classID = "FormEditor";

FormEditor.prototype.DefaultPainter = function() {
    return new FormEditPainter(this);
};

FormEditor.prototype.Refresh = function() {
	// this.GetData("edit", function(result) {
		// result.caller.editData.resetData(result.edit, "", true);
	// });
};

FormEditor.prototype.Initialize = function(params) {
	FormEditor.prototype.parent.prototype.Initialize.call(this, params);
	// alerts("here...")
	this.id = params.id;
	this.mode = parseInt(this.id) == 0 || this.id == "" ? "new" : "edit";
	// console.log(this);
	// this.url = params.url.split("?")[1];
	this.dataset = params.dataset;
	this.postBack = params.postBack;
	this.postBackParams = params.url.split("?")[1];
	// console.log(this.postBack)
	// console.log(this.postBackParams)
	this.dialog = params.dialog;
	this.container = params.container;
	this.labelWidth = defaultValue(params.labelWidth, 0);
	this.containerPadding = defaultValue(params.containerPadding, 0);
	this.pageControlTheme = defaultValue(params.pageControlTheme, "data-entry");
	this.editorTheme = defaultValue(params.editorTheme, "default");
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, false);
	
	this.Events = {};
	this.Events.OnInitData = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitEditor = new EventHandler(this);
	this.Events.OnPost = new EventHandler(this);
	this.Events.OnPostError = new EventHandler(this);
	this.Events.OnPostSuccess = new EventHandler(this);
	this.Events.OnPostSuccess2 = new EventHandler(this);
	
	this.Events.OnPost.add(function(editor) {
		editor.dataset.post(function(dataset, msg, error) {
			// console.log("this is being call twice! who is calling this twice?")
			if(error < 0) {
				var title = "Error";
				if(typeof msg == "string") {
					if(error == 1)
						title = "Incomplete information"
				} else {
					title = msg.title;
					msg = msg.message;
				};
				
				editor.Events.OnPostError.trigger({title:title, msg:msg});
			} else {
				editor.Events.OnPostSuccess.trigger(error ? msg.message: ""); /* pass error so we can evaluate it accordingly */
				// editor.Events.OnPostSuccess2.trigger({msg: error ? msg.message: ""}); /* pass error so we can evaluate it accordingly */
			};
		});	
	});

	if(!this.dialog)	
		this.Events.OnPostSuccess.add(function(editor, info) {
			if(info)
				InfoDialog({
					target: editor.toolbar.Element(),
					title: "Information",
					message: info,
					snap: "bottom",
					inset: false
				});
		});
	
	this.Events.OnPostError.add(function(dialog, error) {
		ErrorDialog({
			// target: dialog.showToolbar ? dialog.toolbar.Element(): dialog.container,
			target: dialog.showToolbar ? dialog.toolbar.getItem("save").Element(): dialog.container,
			title: error.title,
			message: error.msg,
			snap: "bottom",
			inset: !dialog.showToolbar
		});
	});
	
	params.init(this);
	
	var self = this;
	if(this.dataset) {
		self.Events.OnInitData.trigger(self.dataset);
	} else {
		// console.log(this)
		// this.GetData("edit", function(params) {
		this.GetData(self.mode, function(params) {
				// params.qry = self.dataParams.stringifyRec(0);
			},
			function(data) {
				// console.log(data)
				self.mode = data.mode;
				self.Events.OnInitData.trigger(self.dataset = new Dataset(data.edit, "Data"));
				self.Paint();
				self.AfterPaint();  
				if(self.dialog) {
					self.dialog.Painter.Reposition();
					self.dialog.SetEditor(self);
					// console.log(self.dialog)
					// self.dialog.OnEditorLoaded.trigger();
					// self.dialog.EditorLoaded();
					// self.container.trigger("loaded")
				};
				
				// console.log(self.dataset)
				self.dataset.Events.OnPost.add(function(dataset, postCallback) {	
					self.GetData("update", function(params) {
						params.mode = data.mode;
						params.data = dataset.stringifyRec(0);
					}, function(result) {
						var msg;
						if(result.status != 0) {
							msg = {};
							msg.title = "Update error";
							msg.message = result.message;
						} else {
							msg = "";
							self.Events.OnPostSuccess2.trigger(result.update);
						};
						
						postCallback(msg, result.status);
					});
				})
				
			}
		);
		
		params.DelayPainting = true;
	};
	
};
	
// FormEditor.prototype.Save = function() {
	
// };

FormEditor.prototype.GetData = function(mode, init, callback) {	
	var params = {};
	if(this.postBackParams) {
		var p = this.postBackParams.split("&");
		$(p).each(function(i, s) {
			var p = s.split("=");
			params[p[0]] = p[1];
		});
	};
	
	if(init) init(params);
	
	var parts = this.postBack.split("/");
	// console.log(("{0}/get/{1}/{2}").format(parts[0], defaultValue(mode, "edit"), parts[1]));
	// console.log(mode)
	if(parts.length == 2)
		desktop.Ajax(this, ("/{0}/get/{1}/{2}").format(parts[0], defaultValue(mode, "edit"), parts[1]), params, callback)
	else
		desktop.Ajax(this, ("/get/{0}/{1}").format(defaultValue(mode, "edit"), this.postBack), params, callback);
	// desktop.Ajax(this, "/engine/get/edit/sys-users", params, callback);
};

FormEditor.prototype.InitializeToolbar = function(toolbar) {
	var self = this;
	this.toolbar = toolbar;
	
	toolbar.NewItem({
		id: "refresh",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "refresh",
		iconColor: "#8DCF6E",
		hint: "Refresh",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(!dataset.editing);
		},
		click: function(item) {
			// grid.Refresh();
		}
	});
	
	toolbar.NewItem({
		id: "cancel",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "db-cancel",
		// iconColor: "#8DCF6E",
		iconColor: "firebrick",
		hint: "Cancel edit",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(dataset.editing);
		},
		click: function(item) {
			item.dataBind.cancel();
		}
	});
	
	toolbar.NewItem({
		id: "save",
		// icon: grid.options.toolbarSize == 16 ? "/engine/images/refresh.png": "/engine/images/refresh-24.png",
		icon: "db-save",
		iconColor: "#1CA8DD",
		hint: "Save",
		dataBind: this.dataset,
		dataEvent: function(dataset, button) {
			button.show(dataset.editing);
		},
		click: function(item) {
			self.Events.OnPost.trigger();
		}
	});
	
	this.Events.OnInitToolbar.trigger(toolbar);
};

FormEditor.prototype.InitializeEditor = function(editor) {
	this.Events.OnInitEditor.trigger(editor);
};

FormEditor.prototype.AfterPaint = function() {
	FormEditor.prototype.parent.prototype.AfterPaint.call(this); 
	if(this.Painter.pageControl.TabCount() == 1) {
		this.Painter.pageControl.ShowTabs(false);
	};
};

//**************************************************************************************************
// FormEditPainter
//**************************************************************************************************
Class.Inherits(FormEditPainter, JControlPainter);
function FormEditPainter(Control) {
	FormEditPainter.prototype.parent.call(this, Control);
	this.Control = Control;
};

FormEditPainter.prototype.classID = "FormEditPainter";
FormEditPainter.prototype.type = "form-edit";

FormEditPainter.prototype.InitializePageControl = function(pg) {
	var self = this;

	var editorInit = {
		PageControl: pg,
		NewGroupEdit: function(caption, initEditor, dataset) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					var container = CreateElement("div", tab.content)
						.attr("x-sec", "edit-container")
						.css("overflow-y", "auto")
						.css("padding", self.Control.containerPadding);
						
					var subContainer = CreateElement("div", container)
						.attr("x-sec", "edit-sub-container");
						
					if(self.Control.fillContainer) 
						subContainer.attr("x-fill", "1")
					
					var editor = new JEditor({
						ID: "edit_" + tab.id,
						Container: subContainer,
						Theme: self.Control.editorTheme,
						Css: "editor",
						LabelWidth: self.Control.labelWidth
					});	          
					
					var group = this;
					
					editor.Dataset = defaultValue(dataset, tab.pg.owner.dataset);
					editor.Dataset.Events.OnChanged.add(function(dataset, columnName) {
						group.OnDatasetChanged.trigger(columnName);
					});
					editor.Dataset.Events.OnCancel.add(function(dataset) {
						group.OnDatasetChanged.trigger();
					});
					
					this.OnDatasetChanged = new EventHandler(this);
					editor.group = this;
					editor.group.dataset = editor.Dataset;
					
					initEditor(editor, tab);
					
					editor.Paint();
					editor.AfterPaint();
					
					if(editor.Dataset) editor.Dataset.updateControls();
					
					editor.FocusFirstEditor();
				}
			});
		},
		NewContainer: function(caption, initContainer) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					var container = CreateElement("div", tab.content).attr("x-sec", "edit-container").css("padding", self.Control.containerPadding);
					var subContainer = CreateElement("div", container).attr("x-sec", "edit-sub-container")
					
					initContainer(subContainer, tab);
				}
			});
		},
		NewSubSelectionView: function(caption, height, selectionColumnName, initView) {
			pg.NewTab(caption, {
				OnCreate: function(tab) {
					tab.content.css("height", height);
					
					var container = CreateElement("div", tab.content)
						.attr("x-sec", "edit-container")
						.css("overflow-y", "auto")
						.css("padding", self.Control.containerPadding);
						
					var subContainer = CreateElement("div", container)
						.attr("x-sec", "edit-sub-container");
						
					if(self.Control.fillContainer) 
						subContainer.attr("x-fill", "1")
					
					var params = {
						editor: self,
						container: subContainer,
						selectionColumn: self.Control.dataset.Columns.get(selectionColumnName)
					};
					
					initView(params);
				}
			});
		}
	};
	
	this.Control.InitializeEditor(editorInit);
};

FormEditPainter.prototype.InitializeToolbar = function(toolbar) {
	this.Control.InitializeToolbar(toolbar);
};

FormEditPainter.prototype.Paint = function() {
	FormEditPainter.prototype.parent.prototype.Paint.call(this); 
	var container = CreateElement("div", this.Control.container)
		.addClass("form-edit")
		.attr("x-sec", "main-container");
		
	if(this.Control.showToolbar) {
		var toolbarContainer = CreateElement("div", container)
			.attr("x-sec", "toolbar-container");

		var toolbar = new JToolbar({
				// id: "tb",
				// container: container,
				container: toolbarContainer,
				css: "toolbar",
				// theme: this.Control.options.toolbarTheme,
				theme: "svg",
				// buttonSize: this.Control.options.toolbarSize
				buttonSize: 24
		});
				
		this.InitializeToolbar(toolbar);
	};
	
	var subContainer = CreateElement("div", container)
		.attr("x-sec", "sub-container");
		
	this.pageControl = new JPageControl({
		owner: this.Control,
		container: subContainer,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: false,
			theme: this.Control.pageControlTheme
		},
		init: function(pg) {
			pg.owner.Painter.InitializePageControl(pg);
		}
	});

	if(this.Control.showToolbar) {
		toolbar.SetVisible("cancel", false);
		toolbar.SetVisible("save", false);
	};
	
	this.SetContainer(container);
};
