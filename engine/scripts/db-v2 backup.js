// ****************************************************************************************************
// Last modified on
// 14-SEP-2014 ihms.0.0.0.1
// 24-SEP-2014 ihms.0.0.0.5
// 01-OCT-2014 ihms.0.0.0.8
// 22-OCT-2014 ihms.0.0.1.3
// 02-FEB-2015 ihms.1.0.0.1 added getBinding and getControl to object Dataset
// ****************************************************************************************************
//==================================================================================================
// Column
//==================================================================================================
function Column(dataset, fname) {
	this.dataset = dataset;
	this.fname = fname;
	this.label = fname;
	this.type = "";
	this.format = "";
	this.maxLength = 0;
	this.upperCase = false;
	this.password = false;
	this.required = false;
	this.numeric = false;
	this.readonly = false;
};

Column.prototype.setprops = function(props) {
	this.type = defaultValue(props.type, this.type);
	this.label = defaultValue(props.label, defaultValue(this.label, this.fname));
	// this.label = props.label == undefined ? this.fname : props.label;
	this.maxLength = defaultValue(props.maxLength, defaultValue(this.maxLength, 0));
	// this.maxLength = props.maxLength == undefined ? 0 : props.maxLength;
	this.upperCase = defaultValue(props.upperCase, defaultValue(this.upperCase, false));
	// this.upperCase = props.upperCase == undefined ? false : props.upperCase;
	this.password = defaultValue(props.password, defaultValue(this.password, false));
	// this.password = props.password == undefined ? false : props.password;
	this.required = defaultValue(props.required, defaultValue(this.required, false));
	// this.required = props.required == undefined ? false : props.required;
	this.numeric = defaultValue(props.numeric, defaultValue(this.numeric, false));
	// this.numeric = props.numeric == undefined ? false : props.numeric;
	this.readonly = defaultValue(props.readonly, defaultValue(this.readonly, false));
	// this.readonly = props.readonly == undefined ? false : props.readonly;
	this.key = defaultValue(props.key, defaultValue(this.key, false));
	// this.key = props.key == undefined ? false : props.key;
	this.format = defaultValue(props.format, this.format);
	this.lookupDataset = props.lookupDataset;
	// console.log(this.lookupDataset)
	// if(this.lookupDataset)
		// desktop.cacheDataset.add(this.lookupDataset.tableName, this.lookupDataset.data, function(data) {
			// return {
				// page: 1,
				// row_count: 0,
				// page_count: 0,
				// table_count: 1,
				// crud: {"add":false,"edit":false,"delete":false},
				// data_0: data
			// };
		// });
		// desktop.cacheDataset.add(self.cacheDatasetName, data);
	
	if(this.key) {
		this.dataset.primaryKey = this.fname;
	};
	
	if(props.type == "date" && !props.format) {
		// this.format = "mm/dd/yy";
		// this.format = "dd/mm/yy";
		this.format = __dateformat;
	};
	
	if(props.type == "money" && props.format) {
		this.format = props.format;
	};
	
	this.onChange = defaultValue(props.onChange, this.onChange);
	this.getText = defaultValue(props.getText, this.getText);
};
	
Column.prototype.isReadonly = function() {
	return this.readonly || this.dataset.readonly; 
};

Column.prototype.get = function() {
	return this.dataset.get(this.fname);
};

Column.prototype.raw = function() {
	return this.dataset.raw(this.fname);
};
	
Column.prototype.text = function() {
	var v = this.dataset.raw(this.fname);
	
	if(this.getText) {
		v = this.getText(this, v);
	} else if(this.type == "money") {		
		if(v == null) 
			v = ""
		else
			v = parseFloat(v).formatMoney(this.format);
	} else if(this.type == "date") {		
		if(v != null && v != undefined) {
			if(this.format == "datetime") {
				v = this.dataset.formatDateTime(this.fname);
			} else {
				var dateParts = v.split("T");
				if(dateParts.length == 2) {
					var date;
					try {
						date = dateParts[0].parseDate("yy-mm-dd");
						v = date.format(this.format);
					} catch(error) {
						v = null;
					};
					
				};
			};
        };
	} else if(this.type == "time") {		
		if(v != null && v != undefined) {
			var dateParts = v.split("T");
            if(dateParts.length == 2) {
							try {
								v = dateParts[1]
							} catch(error) {
								v = null;
							};
            };
        };
	} else if(v == null) {
		v = "";
	};
	
	return v;
};
	
Column.prototype.getMinutes = function() {
	var v = this.dataset.raw(this.fname);
	var min = 0;
	
	if(this.type == "date" || this.type == "time") {
		if(v != null && v != undefined) {
			var dateParts = v.split("T");
			if(dateParts.length == 2) {
				try {
					var timeParts = dateParts[1].split(":");
					min = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
				} catch(error) {
					
				};
			};
		};
	};
	
	return min;
};
	
Column.prototype.asFloat = function() {
	return parseFloat(this.dataset.raw(this.fname));
};
	
Column.prototype.isNull = function() {
	return this.dataset.raw(this.fname) == null;
};
	
Column.prototype.asDate = function() {
	var v = this.dataset.raw(this.fname);
	var date = null;
	
	if(this.type == "date") {
		if(v != null && v != undefined) {
			var dateParts = v.split("T");
            if(dateParts.length == 2) {
				try {
            		date = dateParts[0].parseDate("yy-mm-dd");
			    } catch(error) {
			    	
			    };
            };
        };
	};
	
	return date;
};
	
Column.prototype.asTime = function() {
	var v = this.dataset.raw(this.fname);
	var date = null;
	
	if(this.type == "date" || this.type == "time") {
		if(v != null && v != undefined) {
			var dateParts = v.split("T");
			if(dateParts.length == 2) {
				try {
					date = dateParts[0].parseDate("yy-mm-dd");
					var timeParts = dateParts[1].split(":");
					date.setHours(parseInt(timeParts[0]));
					date.setMinutes(parseInt(timeParts[1]));
					date.setSeconds(parseInt(timeParts[2]));
				} catch(error) {
					
				};
			};
		};
	};
	
	return date;
};

Column.prototype.asDateTime = function() {
	var value = "";
	
	if(this.type == "date" || this.type == "time") {
		value = this.text();
		if(value !== "") {
			var dateparts = this.raw().split("T");
			var time = "";
			if(dateparts.length == 2) {
				time = dateparts[1].substring(0, 5);
			};
			
			value = value +" "+ (time ? "@"+ time: "");			
		};
	};
	
	return value;
};

Column.prototype.formatDateTime = function(format) {
	return this.dataset.formatDateTime(this.fname, format);
};

Column.prototype.change = function() {
	if(this.onChange) {
		this.onChange(this)
	};
};

Column.prototype.set = function(value, noEvents) {
	this.dataset.set(this.fname, value, undefined, noEvents);
};

Column.prototype.setDate = function(value, noEvents) {
	var d = value.getDate();
	var m = value.getMonth();
	var y = value.getFullYear();
	
	var date = this.asTime();
	date.setDate(d);
	date.setMonth(m);
	date.setYear(y);
	
	this.set(date, noEvents);
	// this.dataset.set(this.fname, value, undefined, noEvents);
};

// Column.prototype.setTime = function(value, noEvents) {
// };

Column.prototype.setTimeParts = function(hr, min, sec, noEvents) {
	var date = this.asTime();
	if(hr !== undefined) date.setHours(hr);
	if(min !== undefined) date.setMinutes(min);
	if(sec !== undefined) date.setSeconds(sec);
	
	this.set(date);
	// this.dataset.set(this.fname, value, undefined, noEvents);
};

Column.prototype.setReadonly = function(readonly) {
	this.readonly = readonly;
};

Column.prototype.setRequired = function(required) {
	this.required = required;
};

// Column.prototype.setHours = function(value, noEvents) {
	// this.setTimeParts(hr);
// };

//==================================================================================================
// Columns
//==================================================================================================
// Columns.prototype.add = function(fname)
// Columns.prototype.get = function(fname)
// Columns.prototype.clear = function()
// Columns.prototype.each = function(callback)
// Columns.prototype.setprops = function(fname, props)
//==================================================================================================
function Columns(dataset) {
	this.dataset = dataset;
	this.names = [];
	this.columns = [];
};
	
Columns.prototype.add = function(fname) {
	var column = new Column(this.dataset, fname);
	this.names.push(fname);
	this.columns.push(column);
	return column;
};

Columns.prototype.get = function(fname) {
	var i = this.names.indexOf(fname);
	return i < 0 ? undefined: this.columns[i];
};
	
Columns.prototype.clear = function() {
	this.names = [];
	this.columns = [];
};
	
Columns.prototype.each = function(callback) {
	$(this.columns).each(function(i, c) {
		callback(i, c);
	});
};

Columns.prototype.setprops = function(fname, props) {
	var column = this.get(fname);
	
	if(!column) {
		column = this.add(fname);
	};
	
	if(props == undefined) {
		props = {};
	};
	
	column.setprops(props);
	if(column.key) {
		this.dataset.primaryKey = column.fname;
	};
	
	return this;
};

Columns.prototype.contains = function(fname) {
	var i = this.names.indexOf(fname);
	return i >= 0 ;
};

//==================================================================================================
// Dataset
//==================================================================================================
function Dataset(rawData, tableName, dsName) {
	var self = this;
	
	this.name = dsName;
	this.tableName = tableName;
	this.data = rawData;
	this.delta = [];
	this.deltaKeys = [];
	this.recNo = 0;
	// this.controls is an array of data-aware controls
	this.controls = [];
	this.primaryKey = "";
	
	this.enableEvents = true;
	
	this.Methods = new MethodHandler(this);
	
	this.Events = {};
	this.Events.OnEdit = new EventHandler(this);
	this.Events.OnEditState = new EventHandler(this);
	this.Events.OnInitEditDialog = new EventHandler(this);
	this.Events.OnEditDialog = new EventHandler(this);
	this.Events.OnNewRecord = new EventHandler(this);
	this.Events.OnDelete = new EventHandler(this);
	this.Events.OnCancel = new EventHandler(this);
	this.Events.OnPost = new EventHandler(this);
	this.Events.OnValidate = new EventHandler(this);
	this.Events.OnAfterPost = new EventHandler(this);
	this.Events.OnServerPost = new EventHandler(this);
	this.Events.OnFetchData = new EventHandler(this);
	this.Events.OnReset = new EventHandler(this);
	this.Events.OnChanged = new EventHandler(this);
	this.Events.OnMoveRecord = new EventHandler(this);
	this.Events.OnError = new EventHandler(this);
	this.Events.OnWarning = new EventHandler(this);
	// this.Events.OnCustom = new EventHandler(this);
	
	// this.Events.OnMoveRecord = new EventHandler(this);
	// this.Events.OnMoveRecord.add(function(dataset, params) {
		// alerts("still here");
		// dataset.fetch({id:params.id, callback: function(dataset, params) {
			// dataset.resetData(params.data, "edit");
		// });
	// });
	
	// this.ApplyServerUpdate = function(dataset, callback) {
		// callback("", 0);
	// };

	// this.OnNewRecord = function() {};
	this.OnDelete = function() {};
	this.OnPost = function(dataset, callback) {
		callback("", 0);
	};
	// this.OnChanged = function() {};	
     
	this.Columns = new Columns(this);   
	for(var key in this.data[0]) {
		this.Columns.add(key);
	};
	
	// this.columns = [];
	// this.columnNames = [];

	// this.getColumn = function(fname) {
		// var i = this.columnNames.indexOf(fname);
		// if(i < 0) {
			// return undefined
		// } else {
			// return this.columns[i];
		// };
	// };
    
	this.fieldUpdate = function() {
		var binding = $(this).data("binding");
		if(!$(this).is(":focus") && ($(this).is("input") || $(this).is("textarea"))) {
			var column = self.Columns.get(binding.fname);
			if(column.type == "time") {
				var time = binding.dataset.columnByName(binding.fname).asTime();
				if($(this).attr("time") == "hr") {
					$(this).val(time.getHours().strZero(2));
				} else if($(this).attr("time") == "min") {
					$(this).val(time.getMinutes().strZero(2));
				}
			} else {
				$(this).val(binding.dataset.text(binding.fname));
			};
		};
	};
    
	this.fieldChanged = function() {
		var binding = $(this).data("binding");
		var column = self.Columns.get(binding.fname);
		var value = $(this).val();		
		// console.log("1. " + binding.fname);
		if(column.type == "date") {		
			try {
				value = value.parseDate(column.format);
		    } catch(error){
		        value = "";
		    };               			
		} else if(column.type == "time") {
			if(binding.time == "hr") {
				column.setTimeParts(value);
			} else if(binding.time == "min") {
				column.setTimeParts(undefined, value);
			};			
			
			return;
		};
		
		self.set(binding.fname, value);
	};
	
	this.setEditing(false);	
};

Dataset.prototype.each = function(callback) {
	$(this.data).each(function(i, row) {
		callback(row, i);
	};
};

Dataset.prototype.clear = function() {
	this.data = null;
	this.delta = [];
	this.deltaKeys = [];
	this.recNo = 0;
	this.controls = [];    
	this.Columns.clear();
};

Dataset.prototype.columnByName = function(fname) {
	return this.Columns.get(fname);
};

Dataset.prototype.sort = function(fname, order) {
	var isnumeric = false;
	var __sort = function(a, b) {
		var aName, bName;
		if(isnumeric) {
			aName = a[fname];
			bName = b[fname];
		} else {
			aName = a[fname].toLowerCase();
			bName = b[fname].toLowerCase();
		};
		
		if(order == "asc")
			return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0))
		else
			return ((aName > bName) ? -1 : ((aName < bName) ? 1 : 0));
	};

	this.data.sort(__sort);
};

Dataset.prototype.sortString = function(fname, isnumeric) {
	var __sort = function sorit(a, b){
	  var aName, bName;
		if(isnumeric) {
				aName = a[fname];
				bName = b[fname];
		} else {
				aName = a[fname].toLowerCase();
				bName = b[fname].toLowerCase();
		};
	  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
	}

	this.data.sort(__sort);
};

Dataset.prototype.lookup = function(value, fname) {
		var self = this;
		var retValue = "";
		$(this.data).each(function(i, v) {
				if(v[self.primaryKey] == value) {
						retValue = v[fname];
				};
		};
		
		return retValue;
};

Dataset.prototype.locate = function(fname, value) {
		var self = this;
		var found = false;
		$(this.data).each(function(i, v) {
				if(v[fname] == value) {
					found = true;
					self.recNo = i;
					if(self.enableEvents) {
						self.Events.OnMoveRecord.trigger();
					}
				};
		};
		
		return found;
};

Dataset.prototype.gotoKey = function(value) {
		var self = this;
		var fname = this.primaryKey;
		var found = false;
		$(this.data).each(function(i, v) {
			if(v[fname] == value) {
				found = true;
				self.recNo = i;
				if(self.enableEvents) {
					self.Events.OnMoveRecord.trigger();
				};
			};
		};
		
		return found;
};

Dataset.prototype.dateValue = function(value) {
	if(Object.prototype.toString.call(value) === "[object Date]") {
		var date = new Date(value);	
		try {
            var d = date.getDate(),
                m = date.getMonth()+1,
                y = date.getFullYear();
                
            return ("{0}-{1}-{2}T{3}").format(parseInt(y),parseInt(m).strZero(2),parseInt(d).strZero(2), "00:00:00");
	    } catch(error){
	        return null;
	    };               			
	};
};

Dataset.prototype.fetch = function(params) {
	this.Events.OnFetchData.trigger(params);
};

Dataset.prototype.setEditing = function(editing) {
	this.Events.OnEditState.trigger(this.editing = editing);	
};

Dataset.prototype.resetData = function(rawData, resetMode, noUnbind) {
	this.resetMode = resetMode;
	this.data = rawData;
	this.delta = [];
	this.deltaKeys = [];
	this.recNo = 0;
	this.setEditing(false);
	if(!noUnbind) {
		this.unbindControls();
		this.Events.OnReset.trigger(resetMode);
	} else {
		this.updateControls();
	}
};

Dataset.prototype.append = function() {
	var rec = {};
	this.Columns.each(function(i, column) {
		rec[column.fname] = null;
	});

	this.data.push(rec);
	this.recNo = this.data.length - 1;
	// this.OnNewRecord(this);
	this.Events.OnNewRecord.trigger();
};

Dataset.prototype.edit = function() {
	if(this.editing) {
		return;
	};
	
	this.setEditing(true);
	this.Events.OnEdit.trigger();
};

Dataset.prototype.cancel = function() {
	var i = this.deltaKeys.indexOf(this.recNo);
	
	if(i > -1) {
		var delta = this.delta[i];
		
		for (var prop in this.data[this.recNo]) {
			this.data[this.recNo][prop] = delta[prop];
		};
		
		this.delta.splice(i, 1);
		this.deltaKeys.splice(i, 1);
		this.updateControls();
	};

	this.setEditing(false);
	this.Events.OnCancel.trigger();
	// this.OnCancel(this);
};

Dataset.prototype.applyUpdate = function(msg, error, noEvent) {
	if(error >= 0) {
		var i = this.deltaKeys.indexOf(this.recNo);
		
		if(i > -1) {	
			this.delta.splice(i, 1);
			this.deltaKeys.splice(i, 1);
		};

		this.setEditing(false);
		if(noEvent == undefined) {
			this.Events.OnAfterPost.trigger();
		};
	} else {
		this.error(msg, error);
	};		
};

Dataset.prototype.serverPost = function(callback) {
	this.Events.OnServerPost.trigger(callback);
	// var self = this;
	// this.Events.OnServerPost.trigger(function(msg, error) {
		// self.applyUpdate(msg, error);
	// });
};

Dataset.prototype.stringifyRec = function(recno) {
	return "["+ JSON.stringify(this.data[recno == undefined ? this.recNo : recno]) +"]";
};

Dataset.prototype.post = function(callback) {
	var msg = [];
	var mandatoryFields = [];
	this.Columns.each(function(i, column) {
		if(column.required && (column.text() === "" || (column.numeric && column.raw() == 0) || (column.type == "date" && column.asDate() == null))) {
			mandatoryFields.push(column.label);
		};
	});
	
	if(mandatoryFields.length > 0) {
		msg.push("<div class='required-fields-error'>")
		msg.push(("<div section='title'>{0}</div>").format("The following fields are required:"));
		$(mandatoryFields).each(function(i, name) {
			msg.push(("<div section='item'>{0}. {1}</div>").format(i+1, name));
		});
		msg.push("</div>");
	} else {	
		var validateError = [];
		this.Events.OnValidate.trigger(validateError);
		if(validateError.length > 0) {
			msg.push("<div class='required-fields-error'>")
			msg.push(("<div section='title'>{0}</div>").format("Data validation errors:"));
			$(validateError).each(function(i, name) {
				msg.push(("<div section='item'>{0}. {1}</div>").format(i+1, name));
			});
			msg.push("</div>");
		};
	};
	
	if(msg.length > 0) {
		if(callback) {
			// It is up the caller to display the error message
			// Send back error number greater than 0 to indicate client-side validation
			callback(this, msg.join(""), -1); 
		} else {
			this.error(msg.join(""), -1);
		}
	} else {
		// alerts(msg.length);
		// alerts("here", msg);
		var self = this;
		// if(callback) {
			this.Events.OnPost.trigger(function(msg, error) {	
				self.applyUpdate(msg, error);
				if(callback !== undefined) {
					callback(self, msg, error);
				};
			});
		// } else {
			// self.applyUpdate("", 0, true); // Just post it, but do not call OnAfterPost
		// };
	};
};


Dataset.prototype.changed = function(fname, noUpdateControls) {
	if(!this.editing) {
		this.edit();
	};

	this.Columns.get(fname).change(this.recNo);	
	this.Events.OnChanged.trigger(fname);
	// console.log(fname)
	// console.log(noUpdateControls)
	if(!noUpdateControls) {
		// console.log("updated " + fname)
		this.updateControl(fname);		
	};
};

// 22-OCT-2014 ihms.0.0.1.3: added result from server
Dataset.prototype.error = function(msg, error, result) {
	this.Events.OnError.trigger({id:error, msg:msg, result:result});
};

Dataset.prototype.warning = function(msg, error, result) {
	this.Events.OnWarning.trigger({id:error, msg:msg, result:result});
};

Dataset.prototype.updateControls = function() {
	var self = this;
	$(this.controls).each(function(i, v) {
		var binding = v.data("binding");
		v.trigger("update", [self, self.Columns.get(binding.fname)]);
//		alerts(i, v)
	});
};

Dataset.prototype.getBinding = function(fname) {
	var self = this;
	var binding = undefined;
	$(this.controls).each(function(i, v) {
		binding = v.data("binding");
		if(fname == binding.fname) {
			return binding;
		};		
	});
	
	return binding;
};

Dataset.prototype.getControl = function(fname) {
	var self = this;
	var control = undefined;
	$(this.controls).each(function(i, v) {
		var binding = v.data("binding");
		if(fname == binding.fname) {
			control = v;
		};
	});
	
	return control;
};

Dataset.prototype.updateControl = function(fname) {
	this.updateControls();

//	THis is not working yet...
	// var self = this;
	// $(this.controls).each(function(i, v) {
		// var binding = v.data("binding");
		// if(v.fname == fname) {
			// v.trigger("update", [self, self.Columns.get(v.fname)]);
		// };
	// });
};

Dataset.prototype.unbindControls = function() {
		this.controls = [];
};

Dataset.prototype.bindControl = function(control, binding, custom) {
//	control must be a jQuery object, so we can store custom data
	var self = this;
	binding.dataset = this;
	control.data("dataset", this);
	control.data("binding", binding);
	control.bind("update", this.fieldUpdate);
	if(!custom) {
		control.bind("change", this.fieldChanged);
		control.bind("input", function() { // input event does not work in IE8 & below
			self.edit();
		});
	};
	
	binding.control = control;
	// binding.data("control", control);
	

//	control.bind("gettext", this.getFieldText);
//	control.bind("input", function() {
//		var binding = $(this).data("binding");
//		self.set(binding.fname, $(this).val());
//	});
//	control.bind("change", function() {
////		alerts("change")	
//	});
	
	var column = this.Columns.get(binding.fname);
	if(column && column.type == "date" && !column.isReadonly()) {
//		control.datepicker();
	};

	if(column.isReadonly()) {
//		alerts("readonly", column.readonly)
//		control.readOnly = true;
		control.attr("readonly", "readonly");		
	};

	if(column.maxLength) {
		control.attr("maxLength", column.maxLength);		
	};

	if(column.upperCase) {
		control.css("text-transform", "uppercase");		
	};
		
	this.controls.push(control);
	
	return control;
};

Dataset.prototype.count = function() {
	return this.data.length;
};

Dataset.prototype.empty = function() {
	return this.data.length == 0;
};

Dataset.prototype.bof = function() {
	return this.recNo == 0;
};

Dataset.prototype.eof = function() {
	return this.recNo > this.data.length - 1;
};

Dataset.prototype.first = function(noEvent) {
	this.recNo = 0;
	if(!noEvent && this.enableEvents) {
		this.updateControls();
		this.Events.OnMoveRecord.trigger();
	}
};

Dataset.prototype.next = function(noEvent) {
	if(!this.eof())	{
		this.recNo++;
		if(!noEvent && this.enableEvents) {
			this.updateControls();
			this.Events.OnMoveRecord.trigger();
		}
	};
};

Dataset.prototype.previous = function(noEvent) {
	if(!this.bof())	{
		this.recNo--;
		if(!noEvent && this.enableEvents) {
			this.updateControls();
			this.Events.OnMoveRecord.trigger();
		}
	};
};

Dataset.prototype.raw = function(fname, recno) {
    if(recno == undefined) {
    	recno = this.recNo;
    };
    
    return this.data[recno][fname];
};

Dataset.prototype.getKey = function(recno) {
	// return this.get(this.key, recno);
	return this.get(this.primaryKey, recno);
};

Dataset.prototype.getColumnKey = function() {
	// return this.get(this.key, recno);
	return this.Columns.get(this.primaryKey);
};

Dataset.prototype.get = function(fname, recno) {
	if(recno == undefined) {
		recno = this.recNo;
	};
    
  var v = this.data[recno][fname];
	// var column = this.getColumn(fname);
	var column = this.Columns.get(fname);
	if(column) {		
		if(column.getText) {
			v = column.getText(this, fname, v);
		} else if(column.type == "time") {
			var dateParts = v.split("T");
			if(dateParts.length == 2) {
				try {
					v = dateParts[1];
				} catch(error){
					v = null;
				};               
			};
		} else if(column.type == "date") {
			if(this.format == "datetime") {
				v = this.dataset.formatDateTime(this.fname);
			} else {
				var dateParts = v.split("T");
				if(dateParts.length == 2) {
					var date;
					try {
						date = dateParts[0].parseDate("yy-mm-dd");
						v = date.format(column.format);
					} catch(error){
						v = null;
					};               
				};
			};
		}
	}
    
    if(v == null)
        return ""
    else
        return v;
};
	
Dataset.prototype.isNull = function(fname) {
	return this.Columns.get(fname).isNull();
};

Dataset.prototype.asDate = function(fname, recno) {
	return this.Columns.get(fname).asDate();
};

Dataset.prototype.asFloat = function(fname, recno) {
	return parseFloat(this.get(fname, recno));
};

Dataset.prototype.text = function(fname) {
	return this.Columns.get(fname).text();
};

Dataset.prototype.set = function(fname, value, recno, noEvents) {
    if(recno == undefined) {
    	recno = this.recNo;
    } else {
			this.recNo = recno;
		};

	var column = this.Columns.get(fname);
	if(column.type == "date" && Object.prototype.toString.call(value) === "[object Date]") {
		var date = new Date(value);	
		try {
			var d = date.getDate(),
					m = date.getMonth()+1,
					y = date.getFullYear(),
					hr = date.getHours(),
					min = date.getMinutes(),
					sec = date.getSeconds(),
					time = "00:00:00";

			var dateParts;
			if(column.text() != null) {
				dateParts = this.data[recno][fname].split("T");
			};
			
			if(dateParts) {
				if(dateParts.length == 2) {
					time = dateParts[1];
				};
			};
              
			value = ("{0}-{1}-{2}T{3}").format(parseInt(y),parseInt(m).strZero(2),parseInt(d).strZero(2), time);
			// value = ("{0}-{1}-{2}T{3}:{4}:{5}").format(parseInt(y),parseInt(m).strZero(2),parseInt(d).strZero(2), hr.strZero(2), min.strZero(2), sec.strZero(2));
		} catch(error) {
			value = "";
		};
	} else if(column.type == "time" && Object.prototype.toString.call(value) === "[object Date]") {
		var date = new Date(value);	
		try {
			var d = date.getDate(),
					m = date.getMonth()+1,
					y = date.getFullYear(),
					hr = date.getHours(),
					min = date.getMinutes(),
					sec = date.getSeconds(),
					date = "";

			var dateParts;
			if(column.text() != null) {
				dateParts = this.data[recno][fname].split("T");
			};
			
			if(dateParts) {
				if(dateParts.length == 2) {
					date = dateParts[0];
				};
			};
              
			value = ("{0}T{1}:{2}:{3}").format(date, hr.strZero(2), min.strZero(2), sec.strZero(2));
			// alerts("here", value);

			// value = ("{0}-{1}-{2}T{3}:{4}:{5}").format(parseInt(y),parseInt(m).strZero(2),parseInt(d).strZero(2), hr.strZero(2), min.strZero(2), sec.strZero(2));
		} catch(error) {
			value = "";
		};
	} else {
		if(column.upperCase) {
			value = value.toUpperCase();
		};		
	};
	
	var i = this.deltaKeys.indexOf(recno);
	
	if(i == -1) {
		this.deltaKeys.push(recno);		

		var delta = {};
		for (var prop in this.data[recno]) {
			delta[prop] = this.data[recno][prop];
		};
		
		this.delta.push(delta);
	};


	this.data[recno][fname] = value;
	this.changed(fname, noEvents);
	
	return this;
};

Dataset.prototype.setDateTime = function(fname, value, recno, noEvents) {
	if(recno == undefined) {
		recno = this.recNo;
	} else {
		this.recNo = recno;
	};

	var column = this.Columns.get(fname);
	if((column.type == "date" || column.type == "time") && Object.prototype.toString.call(value) === "[object Date]") {
		var date = new Date(value);	
		try {
			var d = date.getDate(),
					m = date.getMonth()+1,
					y = date.getFullYear(),
					hr = date.getHours(),
					min = date.getMinutes(),
					sec = date.getSeconds();

			value = ("{0}-{1}-{2}T{3}:{4}:{5}").format(parseInt(y),parseInt(m).strZero(2),parseInt(d).strZero(2), hr.strZero(2), min.strZero(2), sec.strZero(2));
		} catch(error) {
			value = "";
		};
		
		var i = this.deltaKeys.indexOf(recno);
		
		if(i == -1) {
			this.deltaKeys.push(recno);		

			var delta = {};
			for (var prop in this.data[recno]) {
				delta[prop] = this.data[recno][prop];
			};
			
			this.delta.push(delta);
		};


		this.data[recno][fname] = value;
		this.changed(fname, noEvents);
	};
};

Dataset.prototype.setReadonly = function(fname, readonly) {
	// alerts("here");
	this.Columns.get(fname).setReadonly(readonly);
	// var self = this;
	$(this.controls).each(function(i, v) {
		// alerts(v);
		var binding = v.data("binding");
		// alerts(binding.fname, fname);
		if(binding.fname == fname) {
			// alerts(fname);
			var l = v.data("label");
			if(readonly) {
				v.attr("readonly","readonly");
				if(l) l.attr("readonly","readonly");
			} else {
				v.removeAttr("readonly");
				if(l) l.removeAttr("readonly");
			};
		}
		// v.trigger("update", [self, self.Columns.get(binding.fname)]);
	});
	return this;
};

Dataset.prototype.setRequired = function(fname, required) {
	this.Columns.get(fname).setRequired(required);
	$(this.controls).each(function(i, v) {
		var binding = v.data("binding");
		if(binding.fname == fname) {
			var l = v.data("label");
			if(l) {
				if(required) 
					l.attr("required","required")
				else
					l.removeAttr("required")
			}
		}
	});
	return this;
};

Dataset.prototype.formatDateTime = function(fname, format) {
	var v = this.raw(fname);
	if(!format) {
		format = __dateformat;
	};
	
	var dateTime = v.convertDate(format);
	
	if(v !== null && v !== undefined) {
		var dateParts = v.split("T");
		if(dateParts.length == 2) {
			var timeParts = dateParts[1].split(":");
			var hr = parseInt(timeParts[0]);
			var mn = parseInt(timeParts[1]);
			var sc = parseInt(timeParts[2]);
			var ap = "AM";
			
			if(hr > 12) {
				hr -= 12;
				ap = "PM";
			};
			
			dateTime = ("{0} {1}:{2}:{3} {4}").format(dateTime, hr.strZero(2), mn.strZero(2), sc.strZero(2), ap);
		};
	};
	
	return dateTime;
};
