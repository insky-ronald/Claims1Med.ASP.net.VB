// *************************************************************************************************
// File name: dbeditor.js
// Last modified on
// 06-MAR-2015
// *************************************************************************************************
//**************************************************************************************************
// JEditor
//**************************************************************************************************
Class.Inherits(JEditor, JControl); 
function JEditor(Params) {
    JEditor.prototype.parent.call(this, Params);
};

JEditor.prototype.classID = "JEditor";

JEditor.prototype.Initialize = function(Params) {
    JEditor.prototype.parent.prototype.Initialize.call(this, Params);
	// console.log(Params)
    // this.Editors = [];
    // this.EditorsByID = [];
    // this.CategoriesCount = 0;
	if(!this.PaintParams) this.PaintParams = {};
	this.PaintParams.showCategory = defaultValue(this.PaintParams.showCategory, true);
	this.PaintParams.labelWidth = Params.LabelWidth;
	this.YesNo = [
		{id:true, value:"Yes"},
		{id:false, value:"No"}
	];

    // this.id = "edit_" + Params.ID;
    // this.Page = Params.Page;
    this.container = Params.Container;
    // this.Shown = false;
    // this.Category;
    // this.Css = Params.Css;
	
	this.list = new JList();
	
    Params.DelayPainting = true;
};

JEditor.prototype.AfterPaint = function() {
    JEditor.prototype.parent.prototype.AfterPaint.call(this);
	if(this.Dataset) this.Dataset.Events.OnChanged.trigger();
};

JEditor.prototype.DefaultPainter = function() {
    return new EditorPainter(this);
};

// JEditor.prototype.addGroup = function(params) {
	// this.AddGroup(params.title, )
// };

JEditor.prototype.AddGroup = function(name, init, dataset) {
	var Dataset = dataset ? dataset: this.Dataset;
	var params = {
		caption: name
	};
	
	params.editor = this;
	var group = new JEditCategory(params);
	this.list.add(name, group);

	var self = this;
	var editInit = {
		Dataset: Dataset,
		CreateItem: function(itemClass, attr, options) {
			var edit = self.CreateItem(itemClass, attr, options);
			group.Add(edit);
			return edit;
		},
		AddEdit: function(attr, options) {
			// console.log(options);
			var id = typeof attr == "string" ? attr : attr.ID;
			var column = Dataset.Columns.get(id);
			// console.log(column);
			var editClass = TextEdit;
			if(column.type == "date")
				editClass = DateEdit
			else if(column.type == "money")
				editClass = MoneyEdit
			else if(column.numeric)
				editClass = NumericEdit;
			
			var edit = self.CreateItem(editClass, attr, options);
			group.Add(edit);
			return edit;
		},
		// AddEditx: function(attr, options) {
		// },
		AddText: function(attr, options) {
			var edit = self.AddText(attr, options);
			group.Add(edit);
			return edit;
		},
		AddMemo: function(attr, options) {
			var edit = self.AddMemo(attr, options);
			group.Add(edit);
			return edit;
		},
		AddNumeric: function(attr, options) {
			var edit = self.AddNumeric(attr, options);
			group.Add(edit);
			return edit;
		},
		AddMoney: function(attr, options) {
			var edit = self.AddMoney(attr, options);
			group.Add(edit);
			return edit;
		},
		AddDate: function(attr, options) {
			var edit = self.AddDate(attr, options);
			group.Add(edit);
			return edit;
		},
		AddDateEx: function(attr, options) {
			var edit = self.AddDateEx(attr, options);
			group.Add(edit);
			return edit;
		},
		AddRadioButton: function(attr, options) {
			var edit = self.AddRadioButton(attr, options);
			group.Add(edit);
			return edit;
		},
		AddYesNoRadio: function(attr, options) {
			var edit = self.AddYesNoRadio(attr, options);
			group.Add(edit);
			return edit;
		},
		AddListBox: function(attr, options) {
			var edit = self.AddListBox(attr, options);
			group.Add(edit);
			return edit;
		},
		AddLink: function(attr, options) {
			var edit = self.AddLink(attr, options);
			group.Add(edit);
			return edit;
		},
		AddLookup: function(attr, options) {
			var edit = self.AddLookup(attr, options);
			group.Add(edit);
			return edit;
		},
		AddContainer: function(attr, options) {
			var edit = self.AddContainer(attr, options);
			group.Add(edit);
			return edit;
		}
	};
	init(editInit);
	
	return group;
};

JEditor.prototype.AddYesNoRadio = function(attr, options) {
	return this.CreateItem(RadioButtonEdit, attr, {
		key: "id",
		value: "value",
		data: [
			{id:1, value:"Yes"},
			{id:0, value:"No"}
		]
	});
};

JEditor.prototype.AddRadioButton = function(attr, options) {
	return this.CreateItem(RadioButtonEdit, attr, options);
};

JEditor.prototype.AddListBox = function(attr, options) {
	// return this.CreateItem(ListBoxEdit, attr, options);
	return this.CreateItem(ListBoxEdit, attr, options);
};

JEditor.prototype.AddLink = function(attr, options) {
	return this.CreateItem(LinkEdit, attr, options);
};

JEditor.prototype.AddContainer = function(attr, options) {
	return this.CreateItem(ContainerEdit, attr, options);
};

JEditor.prototype.AddText = function(attr, options) {
	return this.CreateItem(TextEdit, attr, options);
};

JEditor.prototype.AddMemo = function(attr, options) {
	return this.CreateItem(MemoEdit, attr, options);
};

JEditor.prototype.AddNumeric = function(attr, options) {
	return this.CreateItem(NumericEdit, attr, options);
};

JEditor.prototype.AddMoney = function(attr, options) {
	return this.CreateItem(MoneyEdit, attr, options);
};

JEditor.prototype.AddDate = function(attr, options) {
	return this.CreateItem(DateEdit, attr, options);
};

JEditor.prototype.AddDateEx = function(attr, options) {
	return this.CreateItem(DateEditEx, attr, options);
};

JEditor.prototype.AddLookup = function(attr, options) {
	return this.CreateItem(LookupEdit, attr, options);
};

// JEditor.prototype.AddEdit = function(attr, options) {
	// return this.CreateItem(JEditItem, attr, options);
// };

// JEditor.prototype.AddItem = function(attr, options) {
	// return this.CreateItem(JEditItem, attr, options);
// };

JEditor.prototype.GetEditor = function(fname) {
	return this.list.get(fname);
}

JEditor.prototype.SetReadonly = function(fname, readonly) {
	this.list.get(fname).SetReadOnly(readonly);
}

JEditor.prototype.SetVisible = function(fname, visible) {
	this.list.get(fname).SetVisible(visible);
}

JEditor.prototype.CreateItem = function(itemClass, attr, options) {
	if(typeof attr == "string") attr = { ID: attr };
	var params = attr;
	params.options = defaultValue(options, {});
	params.editor = this;
	// console.log(options)
	var edit = new itemClass(params);
	this.list.add(params.ID, edit);
	return edit;
};

JEditor.prototype.EachItem = function(callback) {
	this.list.each(callback);
};

JEditor.prototype.FocusFirstEditor = function() {
	// console.log("FocusFirstEditor")
	var focus;
	
	this.EachItem(function(i, edit) {
		if(edit.dataColumn) {
			if(!edit.readonly && !focus) {
				focus = edit;
			}
		}
	})
	
	// console.log(focus)
	// if(focus) focus.trigger("focus");
	if(focus && focus.Painter.edit) focus.Painter.edit.trigger("focus");
};
/*
//**************************************************************************************************
// JEditItem
//**************************************************************************************************
Class.Inherits(JEditItem, JControl); 
function JEditItem(Params) {
    JEditItem.prototype.parent.call(this, Params);
};

JEditItem.prototype.classID = "JEditItem";

JEditItem.prototype.Initialize = function(params) {
    JEditItem.prototype.parent.prototype.Initialize.call(this, params);
    this.editor = params.editor;
	this.dataset = this.editor.Dataset;
	this.id = params.ID;
	this.caption = params.Caption;
	if(!this.PaintParams) this.PaintParams = defaultValue(params.options, {});
	
	this.dataColumn = this.dataset.Columns.get(this.id);
	if(this.dataColumn.type == "date")
		this.PaintParams.showButton = true
	else
		this.PaintParams.showButton = defaultValue(this.PaintParams.dropdown, false)
	
    params.DelayPainting = true;
};

JEditItem.prototype.DefaultPainter = function() {
    return new EditItemPainter(this);
};

JEditItem.prototype.Paint = function(container) {
	this.container = container;
	// alerts(container);
	JEditItem.prototype.parent.prototype.Paint.call(this);
}

JEditItem.prototype.SetVisible = function(visible) {
	this.elementContainer.css("display", visible ? "" : "none")
	// this.elementContainer.css("height", 20);
	// this.elementContainer.children("td").css("max-height", 4);
}

JEditItem.prototype.GetCaption = function() {
	if(this.dataset)
		return this.dataColumn.label
	else
		return this.id;
}

JEditItem.prototype.Required = function() {
	if(this.dataset)
		return this.dataColumn.required
	else
		return true;
}

//**************************************************************************************************
// JEditLookup
//**************************************************************************************************
Class.Inherits(JEditLookup, JEditItem); 
function JEditLookup(Params) {
    JEditLookup.prototype.parent.call(this, Params);
};

JEditLookup.prototype.classID = "JEditLookup";

JEditLookup.prototype.Initialize = function(params) {
    JEditLookup.prototype.parent.prototype.Initialize.call(this, params);
};

JEditLookup.prototype.DefaultPainter = function() {
    return new EditLookupPainter(this);
};

//**************************************************************************************************
// JEditContainer
//**************************************************************************************************
Class.Inherits(JEditContainer, JEditItem); 
function JEditContainer(Params) {
    JEditContainer.prototype.parent.call(this, Params);
};

JEditContainer.prototype.classID = "JEditContainer";

JEditContainer.prototype.Initialize = function(params) {
    JEditContainer.prototype.parent.prototype.Initialize.call(this, params);
};

JEditContainer.prototype.DefaultPainter = function() {
    return new EditContainerPainter(this);
    // return new EditLookupPainter(this);
};
*/

//**************************************************************************************************
// JEditCategory
//**************************************************************************************************
Class.Inherits(JEditCategory, JControl); 
function JEditCategory(Params) {
    JEditCategory.prototype.parent.call(this, Params);
};

JEditCategory.prototype.classID = "JEditCategory";

JEditCategory.prototype.Initialize = function(params) {
    JEditCategory.prototype.parent.prototype.Initialize.call(this, params);
	this.editor = params.editor;
	this.caption = params.caption;
	this.items = [];
    params.DelayPainting = true;
};

JEditCategory.prototype.DefaultPainter = function() {
    return new EditCategoryPainter(this);
};

JEditCategory.prototype.Paint = function(container) {
	this.container = container;
	JEditCategory.prototype.parent.prototype.Paint.call(this);
}

JEditCategory.prototype.SetVisible = function(visible) {
	$(this.items).each(function(i, edit) {
		edit.SetVisible(visible);
	});
}

JEditCategory.prototype.Add = function(edit) {
	this.items.push(edit);
}

JEditCategory.prototype.GetCaption = function() {
	return this.caption;
}
