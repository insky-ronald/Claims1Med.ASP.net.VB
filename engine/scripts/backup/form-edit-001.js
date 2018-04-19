// ****************************************************************************************************
// File name: form-edit.js
// Last modified on
// 13-MAR-2015
// ****************************************************************************************************
// 01 02 03   04 15 06 07
// dd/MM/yyyy hh:mm:ss tt
function DateInput(obj, editor) {
	this.editor = editor;
	this.dataColumn = editor.dataColumn;
	this.obj = obj;
	// this.sections = [];
	this.items = new JList();
	this.hasTime = this.dataColumn.format == "datetime";
	this.editing = false;
	
	if(!this.dataColumn.isNull()) {
		if(this.hasTime)
			this.date = this.dataColumn.asTime()
		else
			this.date = this.dataColumn.asDate();
	// } else {
		// console.log("null")
		// this.date = Date.today();
	};
	
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
	// console.log(sections)
	
	for(var i = 0; i < sections.length; i++) {
		var section = sections[i]; // day
		if(section.sec == "dd") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "day";
			if(this.dataColumn.isNull())
				section.item.value = ""	
			else
				section.item.value = this.date.getDate().strZero(2);
		} else if(section.sec == "MM") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "month";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				section.item.value = (this.date.getMonth()+1).strZero(2);
		} else if(section.sec == "yyyy") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "year";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				section.item.value = this.date.getFullYear().strZero(4);
		} else if(section.sec == "hh") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "hour";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				section.item.value = this.date.getHours().strZero(2);
		} else if(section.sec == "mm") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "minute";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				section.item.value = this.date.getMinutes().strZero(2);
		} else if(section.sec == "ss") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "second";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				section.item.value = this.date.getSeconds().strZero(2);
		} else if(section.sec == "tt") {
			section.item = new DateInputSection(section.sec, this, 1);
			section.item.name = "apm";
			if(this.dataColumn.isNull())
				section.item.value = ""
			else
				// section.item.value = this.date.getFullYear().strZero(4);
				// section.item.value = "AM";
				section.item.value = this.date.getHours() < 12? "AM" : "PM";
		};
		
		section.item.start = section.start;
		section.item.end = section.end;
		section.item.seq = i+1;
		section.item.max = section.sec.length;
		// section.item[section.item.name] = section.item.value;
		this[section.item.name] = section.item;
		// console.log({n:section.item.name, v:this[section.item.name]})
		
		this.items.add(section.item.name, section.item);
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
	
	// console.log(sections)
	// if(this.dataColumn.format == "datetime") {
		// console.log(this.items.dataColumn);
		// console.log(this);
		// console.log(this.items.items);
	// };
	
	// for(var i = 0; i < this.sections.length; i++) {
		// if(i == 0) {
			// this.sections[i].item.next = this.sections[i+1].item;
			// this.sections[i].item.prev = this.sections[this.sections.length-1].item;
		// } else if(i == this.sections.length-1) {
			// this.sections[i].item.next = this.sections[0].item;
			// this.sections[i].item.prev = this.sections[i-1].item;
		// } else {
			// this.sections[i].item.next = this.sections[i+1].item;
			// this.sections[i].item.prev = this.sections[i-1].item;
		// }
	// };
}; 

// DateInput.prototype.createInput = function(input inputClass) {
	// return inputClass(this);
// };

DateInput.prototype.setDate = function(date) {
	var hours = date.getHours();
	// console.log(date)
	// console.log(hours);
	var values = {
		year: date.getFullYear(),
		month: date.getMonth()+1,
		day: date.getDate(),
		hour: hours > 12 ? hours-12 : (hours == 0 ? 12: hours),
		// hour: hours,
		minute: date.getMinutes(),
		second: date.getSeconds(),
		apm: hours >= 12 ? "PM" : "AM"
	};
	
	
	// this.items.each(function(i, section, sections) {
		// section.set(values[section.name]);
	// });
	// return;
	
	this.items.each(function(i, section, sections) {
		section.value = values[section.name];
	});
	
	// console.log(values)
	var date = this.valid(values);
	this.dataColumn.set(date);
	this.obj.val(this.stringDate2(values));
	this.editor.calendar.calendar.Select(date, true);
};

DateInput.prototype.each = function(callback) {
	// console.log("here")
	this.items.each(function(i, section, sections) {
		callback(section);
	});
	
	// for(var i = 0; i < this.sections.length; i++) {
		// callback(this.sections[i].item);
	// };
};

DateInput.prototype.section = function() {
	var start = this.obj[0].selectionStart;
	var end = this.obj[0].selectionEnd;
	
	// if(start == 0 && end == 10) {
	if(start == 0 && end == this.obj.val().length) {
		// console.log({start:start, end:end, length:this.obj.val().length)
		// console.log(this.items.getByIndex(0))
		return this.items.getByIndex(0)
	} else if(start <= 2) {
		return this.items.getByIndex(0)
	} else if(start >= 3 && start <= 5) {
		return this.items.getByIndex(1)
	} else if(start >= 6) {
		return this.items.getByIndex(2)
	};
	
	// if(start == 0 && end == 10) {
		// return this.sections[0].item
	// } else if(start <= 2) {
		// return this.sections[0].item
	// } else if(start >= 3 && start <= 5) {
		// return this.sections[1].item
	// } else if(start >= 6) {
		// return this.sections[2].item
	// };
};

DateInput.prototype.pos = function() {
	return {
		start: this.obj[0].selectionStart,
		end: this.obj[0].selectionEnd
	};
};

DateInput.prototype.currentItem = function() {
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

DateInput.prototype.val = function() {
	return this.obj.val();
};

// DateInput.prototype.valid = function(y, m, d) {
	// returns null if invalid other wise returns the parsed date
	// return ("{0}-{1}-{2}").format(y, m, d).parseDate("yyyy-M-d");
// };

DateInput.prototype.valid = function(values) {	
	values.year = parseInt(values.year);
	values.month = parseInt(values.month);
	values.day = parseInt(values.day);
	if(this.hasTime) {
		values.hour = parseInt(values.hour);
		values.minute = parseInt(values.minute);
		values.second = parseInt(values.second);
		return ("{0}-{1}-{2} {3}:{4}:{5} {6}").format(values.year.strZero(4), values.month.strZero(2), values.day.strZero(2), values.hour.strZero(2), values.minute.strZero(2), values.second.strZero(2), values.apm).parseDate("yyyy-MM-dd hh:mm:ss tt")
	} else {
		return ("{0}-{1}-{2}").format(values.year, values.month, values.day).parseDate("yyyy-M-d");
	};
};

DateInput.prototype.stringDate = function(y, m, d) {
	var value = __dateformat;
	value = value.replace("dd", parseInt(d).strZero(2));
	value = value.replace("MM", parseInt(m).strZero(2));
	value = value.replace("yyyy", parseInt(y).strZero(4));
	
	return value;
};

DateInput.prototype.stringDate2 = function(values) {
	var value = __dateformat;
	if(this.hasTime)
		value = __dateformat +" "+ __timeformat;
	
	value = value.replace("dd", parseInt(values.day).strZero(2));
	value = value.replace("MM", parseInt(values.month).strZero(2));
	value = value.replace("yyyy", parseInt(values.year).strZero(4));
	value = value.replace("hh", parseInt(values.hour).strZero(2));
	value = value.replace("mm", parseInt(values.minute).strZero(2));
	value = value.replace("ss", parseInt(values.second).strZero(2));
	value = value.replace("tt", values.apm);
	// console.log(values)
	// console.log(value)
	return value;
};

DateInput.prototype.setEdit = function(y, m, d) {
	this.obj.val(this.stringDate(y, m, d));
	var values = {};
	values.year = y;
	values.month = m;
	values.day = d;
	
	this.obj.val(this.stringDate2(values));
	// this.obj.val(this.stringDate(y, m, d));
};

DateInput.prototype.setEdit2 = function(values) {
	// this.obj.val(this.stringDate(y, m, d));
	// var values = {};
	// values.year = y;
	// values.month = m;
	// values.day = d;
	
	this.obj.val(this.stringDate2(values));
	// this.obj.val(this.stringDate(y, m, d));
};

DateInput.prototype.set = function(y, m, d) {
	this.obj.val(this.stringDate(y, m, d));

	this.items.get("day").value = d;
	this.items.get("month").value = m;
	this.items.get("year").value = y;
	
	var date = ("{0}-{1}-{2}").format(y, m, d).parseDate("yyyy-M-d");
	
	this.dataColumn.set(date);
	this.editor.calendar.calendar.Select(date, true);
};

DateInput.prototype.set2 = function(values) {
	this.items.get("day").value = values.day;
	this.items.get("month").value = values.month;
	this.items.get("year").value = values.year;

	// var date;
	// console.log(this.hasTime)
	if(this.hasTime) {
		this.items.get("hour").value = values.hour;
		this.items.get("minute").value = values.minute;
		this.items.get("second").value = values.second;
		this.items.get("apm").value = values.apm;
		// console.log({"hour+ "+this.items.get("hour").value});
		// date = ("{0}-{1}-{2} {3}:{4}:{5} {6}").format(values.day, values.month, values.year).parseDate("yyyy-M-d");
		// date = ("{0}-{1}-{2} {3}:{4}:{5} {6}").format(values.year, values.month, values.day, values.hour, values.minute, values.second, values.apm).parseDate("yyyy-MM-dd hh:mm:ss tt")
	// } else {
		// date = ("{0}-{1}-{2}").format(values.day, values.month, values.year).parseDate("yyyy-M-d");
	}
	
	this.obj.val(this.stringDate2(values));

	// console.log(values)
	var date = this.valid(values);
	// console.log(date)
	this.dataColumn.set(date);
	this.editor.calendar.calendar.Select(date, true);
};

DateInput.prototype.update2 = function() {
	var complete, d, m, y, values;
	
	if(this.hasTime) {
		// console.log(this.obj.val())
		var parts = this.obj.val().split(" ");
		// console.log(parts)
		values = parts[0].split("/");
		// console.log(values)
	} else {
		values = this.obj.val().split("/");
	};
	
	// console.log(values)
	var current = new Date();
	
	if(values.length == 1) { // entered only day
		d = values[0];
		m = current.getMonth()+1;
		y = current.getFullYear();
		complete = this.valid({year:y, month:m, day:d});
		if(!complete) {
			this.obj.val(("{0}/").format(parseInt(d).strZero(2)));
			this.month.value = "";
			this.year.value = "";
		} else {
			this.obj.val(("{0}/{1}/{2}").format(parseInt(d).strZero(2), parseInt(m).strZero(2), y));
			this.month.value = m;
			this.year.value = y;
		};
		this.day.value = d;
	} else if(values.length == 2) { // entered only day		
		d = values[0];
		m = values[1];
		y = current.getFullYear();
		complete = this.valid({year:y, month:m, day:d});
		if(!complete) {
			this.obj.val(("{0}/{1}/").format(parseInt(d).strZero(2), parseInt(m).strZero(2)));
			this.year.value = "";
		} else {
			this.obj.val(("{0}/{1}/{2}").format(parseInt(d).strZero(2), parseInt(m).strZero(2), y));
			this.year.value = y;
		};
		this.day.value = d;
		this.month.value = m;
	} else {
		d = values[this.day.seq-1];
		m = values[this.month.seq-1];
		y = values[this.year.seq-1];
		complete = true;
	};
	
	var valid = true;
	if(complete) {
		var valuesx = {year:y, month:m, day:d, hour:"00", minute:"00", second:"00", apm:"AM"};
		// var valuesx = {year:y, month:m, day:d};
		// console.log(valuesx)
		if(this.valid(valuesx)) 
			this.set2(valuesx)
		else
			valid = false;
	};
	
	return valid;
};

DateInput.prototype.values = function() {
	var values = {};
	this.items.each(function(i, section, sections) {
		if(section.name == "apm")
			values[section.name] = section.value
		else
			values[section.name] = parseInt(section.value);
	});

	return values;
};

// DateInput.prototype.editingValues = function() {
// };

DateInput.prototype.editingValues = function() {
	var editValues;
	if(this.hasTime) {
		var parts = this.obj.val().split(" ");
		if(parts.length > 0) {
			editValues = parts[0].split("/").concat(parts[1].split(":"));
			editValues.push(parts[2]);
		} else {
			parts = this.obj.val().split(" ");
		}
	} else {
		editValues = this.obj.val().split("/");
	};
	
	var values = {};
	this.items.each(function(i, section, sections) {
		values[section.name] = editValues[section.seq-1];
	});

	return values;
};

DateInput.prototype.update = function() {
	var complete, d, m, y, values;
	// console.log("update")
	if(this.hasTime) {
		// console.log(this.obj.val())
		var parts = this.obj.val().split(" ");
		// console.log(parts)
		values = parts[0].split("/");
		// console.log(values)
	} else {
		values = this.obj.val().split("/");
	};
	
	// console.log(values)
	var current = new Date();
	
	if(this.dataColumn.isNull()) {
		this.setDate(Date.today());
	};
	
	var item;
	if(values.length == 1) { // the input box was initially empty
		item = this.items.getByIndex(0);
		var v = this.values();
		v[item.name] = parseInt(values[0]);

		complete = this.valid(v);
		
		if(!complete) {
			// this.obj.val(("{0}/").format(parseInt(d).strZero(2)));
			// this.month.value = "";
			// this.year.value = "";
			// item.select();
			// console.log(complete)
		} else {
			this.setDate(complete);
			item.next.select();
			console.log(this.values())
		};
	} else {
		d = values[this.day.seq-1];
		m = values[this.month.seq-1];
		y = values[this.year.seq-1];
		complete = true;
	};
	
	var valid = true;
	if(complete) {
		var valuesx = this.values();
		// var valuesx = {year:y, month:m, day:d, hour:"00", minute:"00", second:"00", apm:"AM"};
		// var valuesx = {year:y, month:m, day:d};
		// console.log(valuesx)
		if(this.valid(valuesx)) {
			this.set2(valuesx);
			// item.next.select();
		} else
		// if(this.valid(values)) 
			// this.set2(values)
		// else
			valid = false;
	};
	
	return valid;
};

DateInput.prototype.get = function(sec) {
	this.items.each(function(i, section, sections) {
		if(section.sec == sec) {
			return section;
		};
	});
	// for(var i = 0; i < this.sections.length; i++) {
		// var section = this.sections[i].item;
		// if(section.sec == sec) {
			// return section;
		// };
	// };
};

//**************************************************************************************************
// DateInputSection
//**************************************************************************************************
function DateInputSection(sec, input) {
	this.sec = sec;
	this.seq = 0;
	this.max = 0;
	// this.editing = false;
	this.input = input;
};

DateInputSection.prototype.set = function(value) {
	var values = this.input.values();
	values[this.name] = value;
	if(this.input.valid(values)) {
		this.input.set2(values)
	};
};

DateInputSection.prototype.select = function(noUpdate) {
	if(!noUpdate) {
		if(!this.input.update()) {
			return false;
		};
	};
	
	this.input.obj[0].selectionStart = this.start;
	this.input.obj[0].selectionEnd = this.end;
	
	return true;
};

//**************************************************************************************************
// JBaseDateSectionInput
//**************************************************************************************************
Class.Inherits(JBaseDateSectionInput, JObject);
function JBaseDateSectionInput(params) {
	JBaseDateSectionInput.prototype.parent.call(this, params);
};

JBaseDateSectionInput.prototype.classID = "JBaseDateSectionInput";

//==================================================================================================
// SimpleEditor
//==================================================================================================
function SimpleEditor(params) {
	var editor = new JEditor({
		ID: params.id,
		Container: params.container,
		Theme: params.theme,
		Css: "editor"
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
	this.id = params.id;
	// this.url = params.url.split("?")[1];
	this.dataset = params.dataset;
	this.postBack = params.postBack;
	this.postBackParams = params.url.split("?")[1];
	this.dialog = params.dialog;
	this.container = params.container;
	this.containerPadding = defaultValue(params.containerPadding, 0);
	this.pageControlTheme = defaultValue(params.pageControlTheme, "data-entry");
	this.editorTheme = defaultValue(params.editorTheme, "default");
	this.fillContainer = defaultValue(params.fillContainer, false);
	this.showToolbar = defaultValue(params.showToolbar, true);
	
	this.Events = {};
	this.Events.OnInitData = new EventHandler(this);
	this.Events.OnInitToolbar = new EventHandler(this);
	this.Events.OnInitEditor = new EventHandler(this);
	this.Events.OnPost = new EventHandler(this);
	this.Events.OnPostError = new EventHandler(this);
	this.Events.OnPostSuccess = new EventHandler(this);
	
	this.Events.OnPost.add(function(editor) {
		editor.dataset.post(function(dataset, msg, error) {
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
				// alerts(msg, error);
				editor.Events.OnPostSuccess.trigger(error ? msg.message: ""); /* pass error so we can evaluate it accordingly */
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
		this.GetData("edit", function(params) {
				// params.qry = self.dataParams.stringifyRec(0);
			},
			function(data) {
				self.Events.OnInitData.trigger(self.dataset = new Dataset(data.edit, "Data"));
				self.Paint();
				self.AfterPaint();  
				if(self.dialog) {
					self.dialog.Painter.Reposition();
					self.dialog.SetEditor(self);
				};
				
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
							// self.Refresh();
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
	
	desktop.Ajax(this, ("/get/{0}/{1}").format(defaultValue(mode, "edit"), this.postBack), params, callback);
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
						Css: "editor"
					});	          
					
					editor.Dataset = defaultValue(dataset, tab.pg.owner.dataset);
					// console.log(editor.Dataset.Columns.get("id"))
					
					initEditor(editor, tab);
					
					editor.Paint();
					editor.AfterPaint();
					
					if(editor.Dataset) editor.Dataset.updateControls();
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
		
	// alerts(this.Control.pageControlTheme)
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
