//==================================================================================================
// File name: form-dbedit.js
//==================================================================================================
// *************************************************************************************************
// Last modified on
// 16-OCT-2014 ihms.0.0.1.1
// 22-OCT-2014 ihms.0.0.1.3: Create an "update" error message handler
// 09-NOV-2014 ihms.0.0.1.6
// *************************************************************************************************
Class.Inherits(SubPageEdit, SubPageData);
function SubPageEdit(Params) {
	SubPageEdit.prototype.parent.call(this, Params);
	
	// var self = this;
	this.dataChanged = function(data) {
		data.owner.EditDataChanged(data);
	};	
};

SubPageEdit.prototype.classID = "SubPageEdit";
SubPageEdit.prototype.immediatePaint = false;
SubPageEdit.prototype.showHeader = true;
SubPageEdit.prototype.showToolbar = true;

SubPageEdit.prototype.DefaultPainter = function() {
	return new SubEditPainter(this); // SubEditPainter: refer to form-base-painters.js
}

SubPageEdit.prototype.Save = function(data) {
	var self = this;
	data.post(function(data, msg, error) {
		if(error > 0) {
			var title = "Error";
			if(typeof msg == "string") {
				if(error == 1)
					title = "Incomplete information"
			} else {
				title = msg.title;
				msg = msg.message;
			}
			
			ErrorDialog({
				target: self.toolbar.getItem("save").elementContainer,
				title: title,
				message: msg
			});
		};		
	});
};

SubPageEdit.prototype.Refresh = function() {
	this.GetData("edit", function(result) {
		result.caller.editData.resetData(result.edit, "", true);
	});
};

SubPageEdit.prototype.EditDataChanged = function(data) {
	this.toolbar.SetVisible("cancel", data.editing);
	this.toolbar.SetVisible("save", data.editing);
	this.toolbar.SetVisible("refresh", !data.editing);
};	
	
SubPageEdit.prototype.InitializeEditData = function(data) {
	data.owner = this;
	data.Events.OnChanged.add(this.dataChanged);
	data.Events.OnCancel.add(this.dataChanged);
	data.Events.OnAfterPost.add(this.dataChanged);
	data.Events.OnPost.add(function(data, postCallback) {
		data.owner.GetData("update", function(result) {
			var msg;
			if(result.status != 0) {
				msg = {};
				msg.title = "Update error";
				msg.message = result.message;
			} else
				msg = "";
			
			postCallback(msg, result.status);
		}, function(params) {
			params.data = data.owner.editData.stringifyRec(0);
		});
	})
};

SubPageEdit.prototype.InitializeEditor = function(editor) {
	// if(this.editData.mode = "new") {
		// this.editData.edit();
	// };
};

SubPageEdit.prototype.Initialize = function(Params) {
	SubPageEdit.prototype.parent.prototype.Initialize.call(this, Params);
	this.InitializeEditData(this.editData = new Dataset([], this.dataSource));
};
	
SubPageEdit.prototype.InitializeData = function(data) {
	SubPageEdit.prototype.parent.prototype.InitializeData.call(this, data);
	
	var params = {
		// src: this.dataSource
	};

	var parts = this.url.split("?");
	if(parts.length > 0 {
		var rp = parts[1];
		if(rp) {
			var p = rp.split("&");
			$(p).each(function(i, s) {
				var p = s.split("=");
				params[p[0]] = p[1];
			});
		};
	};
	
	// desktop.Ajax(this, "/api/getdata/edit", params, function(result) {
	desktop.Ajax(this, ("/get/{0}/{1}").format("edit", this.dataSource), params, function(result) {
		result.caller.editData.resetData(result.edit);
		result.caller.editData.mode = result.mode;
		
		// we do painting here as we want to wait for the result of the
		// ajax call to return before painting
		result.caller.Paint();
		result.caller.AfterPaint();  
		result.caller.Painter.createEditor();
	});
};

SubPageEdit.prototype.InitializeToolbar = function(toolbar) {
	// this.Events.OnInitToolbar = new EventHandler(this);
	var self = this;
	
	toolbar.NewItem({
		id: "refresh",
		icon: "/engine/images/refresh-24.png",
		hint: "Refresh",
		click: function(item) {
			self.Refresh();
		}
	});
	
	toolbar.NewItem({
		id: "cancel",
		icon: "/engine/images/rollback-24.png",
		hint: "Cancel",
		click: function(item) {
			self.editData.cancel();
			if(self.editData.mode == "new") {
				window.close();
			}
		}
	});
	
	toolbar.NewItem({
		id: "save",
		icon: "/engine/images/disk-24.png",
		hint: "Save",
		click: function(item) {
			// item.toolbar.owner.Save(item.toolbar.owner.editData);
			self.Save(self.editData);
			// grid.Refresh();
		}
	});
	
	// toolbar.SetVisible("cancel", false);
	// toolbar.SetVisible("save", false);
};

SubPageEdit.prototype.Paint = function() {
	SubPageEdit.prototype.parent.prototype.Paint.call(this);
	// if(this.showToolbar) {
		this.InitializeToolbar(this.toolbar = this.Painter.createToolbar());
	// };
};

SubPageEdit.prototype.AfterPaint = function() {
	SubPageEdit.prototype.parent.prototype.AfterPaint.call(this);
	if(this.editData.mode == "new") {
		this.editData.edit();
	};
	
	this.EditDataChanged(this.editData);
	// this.toolbar.SetVisible("cancel", false);
	// this.toolbar.SetVisible("save", false);
	// if(!this.showHeader) {
		// this.Painter.header.css("height", "100%").remove();
		// this.Painter.content.css("top", 0).css("height", "100%");
	// };
};
