// *************************************************************************************************
// File name: dbeditor-controls.js
// Last modified on
// 06-MAR-2015
// *************************************************************************************************

//**************************************************************************************************
// JBaseEditControl
//**************************************************************************************************
Class.Inherits(JBaseEditControl, JControl); 
function JBaseEditControl(Params) {
    JBaseEditControl.prototype.parent.call(this, Params);
};

JBaseEditControl.prototype.classID = "JBaseEditControl";
JBaseEditControl.prototype.showButton = false;
JBaseEditControl.prototype.buttonIcon = "";
JBaseEditControl.prototype.customControl = false;
JBaseEditControl.prototype.acceptTab = true;
// JBaseEditControl.prototype.showButton = true;
// JBaseEditControl.prototype.buttonIcon = "star";

JBaseEditControl.prototype.DefaultPainter = function() {
    return new BaseEditControlPainter(this);
};

// JBaseEditControl.prototype.CreateEditControl = function(container) {
    // return CreateElement("input", container, "", "");
// };

JBaseEditControl.prototype.Readonly = function() {
	if(this.dataColumn)
		return this.dataColumn.readonly || this.dataColumn.dataset.readonly || this.readonly
	else
		return false;
};

JBaseEditControl.prototype.Initialize = function(params) {
    JBaseEditControl.prototype.parent.prototype.Initialize.call(this, params);
    this.editor = params.editor;
	this.id = params.ID;
	this.caption = params.Caption;
	// this.caption = "XXX";
	// this.noLabel = defaultValue(params.noLabel, false);
	this.noLabel = defaultValue(params.options.noLabel, false);
	this.noLabelPadding = defaultValue(params.noLabelPadding, false);
	this.noFocus = defaultValue(params.noFocus, false);
	// console.log(params)
	this.upperCase = defaultValue(params.options.upperCase, false);
	this.readonly = defaultValue(params.options.readonly, false);
	this.visible = defaultValue(params.options.visible, true);
	// console.log(this)
	this.showCategory = params.editor.PaintParams.showCategory;
	if(!this.PaintParams) this.PaintParams = defaultValue(params.options, {});
	
	this.dataset = params.Dataset ? params.Dataset: this.editor.Dataset;
	this.dataColumn = this.dataset.Columns.get(this.id);
	
    params.DelayPainting = true;
};

JBaseEditControl.prototype.ButtonClick = function(e) {
	// alerts("ButtonClick")
};

JBaseEditControl.prototype.Paint = function(container) {
	this.container = container;
	JBaseEditControl.prototype.parent.prototype.Paint.call(this);
}

JBaseEditControl.prototype.SetVisible = function(visible) {
	// console.log(this.container);
	// console.log(this.Painter.container);
	// this.elementContainer.css("display", visible ? "" : "none")
	this.Painter.SetVisible(this.visible = visible);
}

JBaseEditControl.prototype.SetRequired = function(required) {
	this.Painter.SetRequired(required);
}

JBaseEditControl.prototype.SetReadOnly = function(readonly) {
	this.Painter.SetReadOnly(this.readonly = readonly);
	// console.log(this.container);
	// console.log(this.Painter.container);
	// this.elementContainer.css("display", visible ? "" : "none")
}

JBaseEditControl.prototype.GetCaption = function() {
	if(this.dataset)
		// return this.dataColumn.label
		return defaultValue(this.caption, this.dataColumn ? this.dataColumn.label: "")
	else
		return this.id;
		// return this.caption;
}

JBaseEditControl.prototype.Required = function() {
	if(this.dataset && this.dataColumn)
		return this.dataColumn.required
	else
		return false;
}

//**************************************************************************************************
// TextEdit
//**************************************************************************************************
Class.Inherits(TextEdit, JBaseEditControl); 
function TextEdit(Params) {
    TextEdit.prototype.parent.call(this, Params);
};

TextEdit.prototype.classID = "TextEdit";

TextEdit.prototype.DefaultPainter = function() {
    return new TextEditPainter(this);
};

//**************************************************************************************************
// MemoEdit
//**************************************************************************************************
Class.Inherits(MemoEdit, JBaseEditControl); 
function MemoEdit(Params) {
    MemoEdit.prototype.parent.call(this, Params);
};

MemoEdit.prototype.classID = "MemoEdit";

MemoEdit.prototype.DefaultPainter = function() {
    return new MemoEditPainter(this);
};

MemoEdit.prototype.Initialize = function(params) {
    MemoEdit.prototype.parent.prototype.Initialize.call(this, params);
	this.height = defaultValue(params.options.height, 75);
};

//**************************************************************************************************
// NumericEdit
//**************************************************************************************************
Class.Inherits(NumericEdit, TextEdit); 
function NumericEdit(Params) {
    NumericEdit.prototype.parent.call(this, Params);
};

NumericEdit.prototype.classID = "NumericEdit";

NumericEdit.prototype.DefaultPainter = function() {
    return new NumericEditPainter(this);
};

//**************************************************************************************************
// MoneyEdit
//**************************************************************************************************
Class.Inherits(MoneyEdit, NumericEdit); 
function MoneyEdit(Params) {
    MoneyEdit.prototype.parent.call(this, Params);
};

MoneyEdit.prototype.classID = "MoneyEdit";

MoneyEdit.prototype.DefaultPainter = function() {
    return new MoneyEditPainter(this);
};

//**************************************************************************************************
// DateEdit
//**************************************************************************************************
Class.Inherits(DateEdit, TextEdit); 
function DateEdit(Params) {
    DateEdit.prototype.parent.call(this, Params);
};

DateEdit.prototype.classID = "DateEdit";
DateEdit.prototype.showButton = true;
DateEdit.prototype.buttonIcon = "calendar-blank";

DateEdit.prototype.DefaultPainter = function() {
    return new DateEditPainter(this);
};

DateEdit.prototype.ShowCalendar = function() {
	if(!this.calendar && !this.Readonly()) {
		// this.ButtonClick(this.Painter.button);
		var self = this;
		var edit = this.Painter.edit;
		
		this.calendar = new JPopupDialog({
			Target: edit.parent(),
			Modal: false,
			Painter: {
				painterClass: SimpleDialogPainter,
				color: "#27AE60",
				snap: "bottom",
				align: "left",
				inset: false,
				OnRenderHeader: function(dialog, container) {
					container.remove();
				},
				OnRenderContent: function(dialog, container) {
					dialog.calendar = new JDatePicker({
						container: container,
						target: edit,
						date: self.dataColumn.asDate(),
						options:{
							css: "default",
						},
						init:function(datepicker){
						},
						update:function(datepicker, date, dontClose) {
							self.dataColumn.set(date);
							if(!dontClose) {
								// self.calendar = null;
								dialog.Hide();
							} else {
								datepicker.Refresh(date);
							}
						}
					});				
				},
				OnRenderFooter: function(dialog, container) {
					container.remove();
				}
			},
			onClose:function() {
				self.calendar = null;
				// console.log("ok")
			}
		});
	};
};

DateEdit.prototype.HideCalendar = function() {
	if(this.calendar) this.calendar.Hide();
};

DateEdit.prototype.ButtonClick = function(e) {
	var self = this;
	var edit = this.Painter.edit;
	
	edit.select();
	return;
	this.calendar = new JPopupDialog({
		Target: edit.parent(),
		Modal: false,
		Painter: {
			painterClass: SimpleDialogPainter,
			color: "#27AE60",
			snap: "bottom",
			align: "left",
			inset: false,
			OnRenderHeader: function(dialog, container) {
				container.remove();
			},
			OnRenderContent: function(dialog, container) {
				dialog.calendar = new JDatePicker({
					container: container,
					target: edit,
					date: self.dataColumn.asDate(),
					options:{
            			css: "default",
					},
					init:function(datepicker){
					},
					update:function(datepicker, date, dontClose) {
						self.dataColumn.set(date);
						if(!dontClose) {
							self.calendar = null;
							dialog.Hide();
						} else {
							datepicker.Refresh(date);
						}
					}
				});				
			},
			OnRenderFooter: function(dialog, container) {
				container.remove();
			}
		}
	});
};

//**************************************************************************************************
// DateEditEx
//**************************************************************************************************
/*
Class.Inherits(DateEditEx, DateEdit); 
function DateEditEx(Params) {
    DateEditEx.prototype.parent.call(this, Params);
};

DateEditEx.prototype.classID = "DateEditEx";
DateEditEx.prototype.customControl = true;

DateEditEx.prototype.DefaultPainter = function() {
    return new DateEditExPainter(this);
};
*/
//**************************************************************************************************
// RadioButtonEdit
//**************************************************************************************************
Class.Inherits(RadioButtonEdit, JBaseEditControl); 
function RadioButtonEdit(Params) {
    RadioButtonEdit.prototype.parent.call(this, Params);
};

RadioButtonEdit.prototype.classID = "RadioButtonEdit";
RadioButtonEdit.prototype.customControl = true;

RadioButtonEdit.prototype.DefaultPainter = function() {
    return new RadioButtonEditPainter(this);
};

RadioButtonEdit.prototype.Initialize = function(params) {
    RadioButtonEdit.prototype.parent.prototype.Initialize.call(this, params);
	// alerts(params.key)
	// console.log(params.options)
	this.keyName = params.options.key;
	this.valueName = params.options.value;
	this.data = params.options.data;
};

//**************************************************************************************************
// LinkEdit
//**************************************************************************************************
Class.Inherits(LinkEdit, JBaseEditControl); 
function LinkEdit(Params) {
    LinkEdit.prototype.parent.call(this, Params);
};

LinkEdit.prototype.classID = "LinkEdit";
LinkEdit.prototype.customControl = true;

LinkEdit.prototype.DefaultPainter = function() {
    return new LinkEditPainter(this);
};

LinkEdit.prototype.Initialize = function(params) {
    LinkEdit.prototype.parent.prototype.Initialize.call(this, params);
	this.link = defaultValue(params.options.link, params.link);
};

//**************************************************************************************************
// TimeStamp
//**************************************************************************************************
Class.Inherits(TimeStamp, JBaseEditControl); 
function TimeStamp(Params) {
    TimeStamp.prototype.parent.call(this, Params);
};

TimeStamp.prototype.classID = "TimeStamp";
TimeStamp.prototype.customControl = true;

TimeStamp.prototype.DefaultPainter = function() {
    return new TimeStampPainter(this);
};

TimeStamp.prototype.Initialize = function(params) {
    TimeStamp.prototype.parent.prototype.Initialize.call(this, params);
	this.name = params.name;
	this.label = params.label;
	// this.datetime = params.datetime;
	// console.log(params)
	// this.link = defaultValue(params.options.link, params.link);
};

//**************************************************************************************************
// ContainerEdit
//**************************************************************************************************
Class.Inherits(ContainerEdit, TextEdit); 
function ContainerEdit(Params) {
    ContainerEdit.prototype.parent.call(this, Params);
};

ContainerEdit.prototype.classID = "ContainerEdit";
ContainerEdit.prototype.acceptTab = false;
// ContainerEdit.prototype.showButton = true;
// ContainerEdit.prototype.buttonIcon = "drop-down";
// ContainerEdit.prototype.defaultColor = "#2196F3";

ContainerEdit.prototype.DefaultPainter = function() {
    return new ContainerEditPainter(this);
};

ContainerEdit.prototype.Initialize = function(params) {
    ContainerEdit.prototype.parent.prototype.Initialize.call(this, params);

	// this.containerInit = params.options.init;
	// this.containerWidth = params.options.width;
	// this.containerHeight = defaultValue(params.options.height, 100);
	// this.containerColor = defaultValue(params.options.color, this.defaultColor);
	this.height = defaultValue(params.height, 75);
	this.initContent = params.initContent;
};

//**************************************************************************************************
// CustomDropDownEdit
//**************************************************************************************************
Class.Inherits(CustomDropDownEdit, TextEdit); 
function CustomDropDownEdit(Params) {
    CustomDropDownEdit.prototype.parent.call(this, Params);
};

CustomDropDownEdit.prototype.classID = "CustomDropDownEdit";
CustomDropDownEdit.prototype.showButton = true;
CustomDropDownEdit.prototype.buttonIcon = "drop-down";
CustomDropDownEdit.prototype.defaultColor = "#2196F3";

CustomDropDownEdit.prototype.DefaultPainter = function() {
    return new CustomDropDownEditPainter(this);
};

CustomDropDownEdit.prototype.Initialize = function(params) {
    CustomDropDownEdit.prototype.parent.prototype.Initialize.call(this, params);

	this.containerInit = params.options.init;
	this.containerWidth = params.options.width;
	this.containerHeight = defaultValue(params.options.height, 100);
	this.containerColor = defaultValue(params.options.color, this.defaultColor);
};

CustomDropDownEdit.prototype.ButtonClick = function(e) {
	var self = this;
	var edit = this.Painter.edit;

	// console.log(this.containerWidth)
	var width = undefined;
	if(this.containerWidth == 0)
		width = undefined
	else
		width = defaultValue(this.containerWidth, edit.parent().outerWidth());
	
	edit.select();
	this.dialog = new JPopupDialog({
		Target: edit.parent(),
		Modal: false,
		Painter: {
			painterClass: SimpleDialogPainter,
			color: this.containerColor,
			snap: "bottom",
			// snap: "right",
			// snap: "top",
			align: "left",
			inset: false,
			// inset: true,
			// width: self.containerWidth,
			width: width,
			OnRenderHeader: function(dialog, container) {
				container.remove();
			},
			OnRenderContent: function(dialog, container) {
				if(self.containerHeight)
					container.css("height", self.containerHeight);
				
				container.css("background", "white");
				
				self.containerInit({owner: dialog, container: container, lookup:true, lookupColumn:self.dataColumn});
			},
			OnRenderFooter: function(dialog, container) {
				container.remove();
			}
		}
	});
};

//**************************************************************************************************
// ListBoxEdit
//**************************************************************************************************
// Class.Inherits(ListBoxEdit, JBaseEditControl); 
Class.Inherits(ListBoxEdit, CustomDropDownEdit); 
function ListBoxEdit(Params) {
    ListBoxEdit.prototype.parent.call(this, Params);
};

ListBoxEdit.prototype.classID = "ListBoxEdit";
ListBoxEdit.prototype.customControl = true;
ListBoxEdit.prototype.showButton = true;
ListBoxEdit.prototype.buttonIcon = "menu";
ListBoxEdit.prototype.defaultColor = "#FF802B";

ListBoxEdit.prototype.DefaultPainter = function() {
    return new ListBoxEditPainter(this);
};

ListBoxEdit.prototype.Initialize = function(params) {
    ListBoxEdit.prototype.parent.prototype.Initialize.call(this, params);
	this.keyName = params.options.key;
	this.valueName = params.options.value;
	this.data = params.options.data;
	this.containerHeight = 0;
	this.containerWidth = 0;

	var self = this;
	this.containerInit = function(params) {
		// console.log(params)
		var dialog = params.owner;	
		var column = self.dataColumn;	
		params.container.attr("edit-sec", "list-box");
		for(var i = 0; i < self.data.length; i++) {
			var selected = column.get() == self.data[i][self.keyName];
			CreateElement("div", params.container)
				.attr("list-sec", "item")
				.data("list-key-id", self.data[i][self.keyName])
				.html(self.data[i][self.valueName])
				.click(function() {
					// console.log($(this).data("list-key-id"))
					column.set($(this).data("list-key-id"));
					dialog.Hide();
				})
		};
	};
};

//**************************************************************************************************
// LookupEdit
//**************************************************************************************************
// Class.Inherits(LookupEdit, TextEdit); 
Class.Inherits(LookupEdit, CustomDropDownEdit); 
function LookupEdit(Params) {
    LookupEdit.prototype.parent.call(this, Params);
};

LookupEdit.prototype.classID = "LookupEdit";
LookupEdit.prototype.showButton = true;
LookupEdit.prototype.buttonIcon = "drop-down-table";
LookupEdit.prototype.defaultColor = "#FF802B";

LookupEdit.prototype.DefaultPainter = function() {
    return new LookupEditPainter(this);
};

LookupEdit.prototype.Initialize = function(params) {
    LookupEdit.prototype.parent.prototype.Initialize.call(this, params);
	var self = this;
	var lookupInit = params.options.init;
	this.initDataRequest = params.options.initDataRequest;
	this.disableEdit = defaultValue(params.options.disableEdit, false);
	
	this.containerInit = function(params) {
		return new JDBGrid({
			params: params,
			Painter: {
				css: "countries"
			},
			init: function(grid) {
				grid.Events.OnInitGrid.add(function(grid) {
					// grid.optionsData.url = "countries";
					grid.optionsData.cache = true;
					grid.options.lookup = params.lookup;
					
					grid.options.showToolbar = true;
					grid.options.toolbarTheme = "svg";
					
					grid.options.horzScroll = false;
					// grid.options.showPager = true;
					grid.options.showPager = false;
					grid.options.showSummary = false;
					grid.options.cardView = false;
					grid.options.autoScroll = true;
					grid.options.allowSort = true;
					// grid.options.showSelection = true;
					grid.options.showBand = false;
					// grid.options.showBand = true;
					grid.options.simpleSearch = true;
				});

				lookupInit(self, grid);
			}
		});	
	};
};

//**************************************************************************************************
// LookupEdit2
//**************************************************************************************************
Class.Inherits(LookupEdit2, CustomDropDownEdit); 
function LookupEdit2(Params) {
    LookupEdit2.prototype.parent.call(this, Params);
};

LookupEdit2.prototype.classID = "LookupEdit2";
LookupEdit2.prototype.showButton = true;
LookupEdit2.prototype.buttonIcon = "drop-down-table";
LookupEdit2.prototype.defaultColor = "#FF802B";

LookupEdit2.prototype.DefaultPainter = function() {
    return new LookupEditPainter(this);
};

LookupEdit2.prototype.Initialize = function(params) {
    LookupEdit2.prototype.parent.prototype.Initialize.call(this, params);
	var self = this;
	var lookupInit = params.options.init;
	var initParams = params.options.initParams;
	this.initDataRequest = params.options.initDataRequest;
	this.disableEdit = defaultValue(params.options.disableEdit, false);
	
	this.containerInit = function(params) {
		return new jGrid($.extend(params, {
			paintParams: {
				css: "lookup",
				toolbar: {theme: "svg"}
			},
			init: function(grid, callback) {					
				grid.Events.OnInit.add(function(grid) {					
					grid.options.horzScroll = false;
					grid.options.allowSort = true;
					grid.options.editNewPage = false;
					grid.options.showSelection = false;
					
					grid.Events.OnInitData.add(function(grid, data) {
						self.dataColumn.lookupDataset = data;
					});
					
					grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
						// console.log("1")
						if(initParams) initParams(dataParams);
					});
				
					grid.methods.add("getCommandIcon", function(grid, column, previous) {
						if(column.command === "select-lookup")
							return "transfer"
						else
							return previous							
					});
								
					grid.methods.add("getCommandHint", function(grid, column, previous) {
						if(column.command === "select-lookup")
							return "Select record"
						else
							return previous							
					});
					
					grid.Events.OnCommand.add(function(grid, column) {	
						if(column.command === "select-lookup")
							self.Select(grid.dataset.getKey());
					});
					
					
					grid.Events.OnInitColumns.add(function(grid) {
						grid.NewBand({fixed:"left"}, function(band) {
							band.NewCommand({command:"select-lookup"});
						});
						grid.NewBand({fixed:"right"}, function(band) {
							band.NewCommand({command:"select-lookup"});
						});
					});	
					
					lookupInit(self, grid);
				});
			}
		}));
	};
};

LookupEdit2.prototype.Select = function(id) {
	desktop.HideHints();
	this.dialog.Hide();
	this.dataColumn.set(id);
};
