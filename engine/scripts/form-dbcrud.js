//==================================================================================================
// File name: form-dbcrud.js
//==================================================================================================
// *************************************************************************************************
// Last modified on
// 24-SEP-2014 ihms.0.0.0.5
// 11-OCT-2014 ihms.0.0.1.0
// *************************************************************************************************
Class.Inherits(SubPageTabular, SubPageTable); 
function SubPageTabular(Params) {
	SubPageTabular.prototype.parent.call(this, Params);
	
	this.Edit = function(id, e) {
		this.dbEdit.Events.OnEditRecord.trigger({id:id, target:e});
	};
	
	this.Delete = function(id, e) {
		this.dbEdit.Events.OnTryDeleteRecord.trigger({id:id, target:e});
	};
	
}; 
 
SubPageTabular.prototype.classID = "SubPageTabular";
SubPageTabular.prototype.ShowToolbutton = false;
SubPageTabular.prototype.ShowDeveloperNotesButton = true;

SubPageTabular.prototype.ShowPageSettings = function() {
	return false;
};

// SubPageTabular.prototype.GetAjaxParams = function() {
	// var Params =  {}
	// var params = window.location.search.substring(1).split("&");

	// var exclusions = ["dbpage","DevNoteID","ActionID","vid"];
	// for (var i = 0; i < params.length; i++) {
		// var val = params[i].split("=");
		// if(exclusions.indexOf(val[0]) == -1) {
			// Params[unescape(val[0])] = unescape(val[1]);
		// };
	// }

	// return Params;
// };

// SubPageTabular.prototype.GetData = function() {
	// var self = this;
	
	// $.ajaxSetup({
		// url: ("{0}/{1}/{2}/callback").format(GetPathName(), GetRequestParams().ActionID, GetRequestParams().vid),
		// global: false,
		// dataType: "json"
	// });	

	// this.Ajax("get", "info", {
		// init: function(params, options) {
			// var p = self.GetAjaxParams();
			// for(i in p) {
				// params[unescape(i)] = unescape(p[i]);
			// };
		// },
		// result: function(data) {
			// self.InitializeData(data);
			// self.Paint();
			// self.AfterPaint();
			// self.WindowResize();
		// }
	// });
	
	// $.ajaxSetup({
		// data: this.GetAjaxParams()
	// });	
// };

// SubPageTabular.prototype.Initialize = function(Params) {
	// SubPageTabular.prototype.parent.prototype.Initialize.call(this, Params);
	// this.PageSize = [
		// {id:25, value:25},
		// {id:50, value:50},
		// {id:75, value:75},
		// {id:100, value:100}
	// ];
// };

SubPageTabular.prototype.InitializeData = function(data) {
	SubPageTabular.prototype.parent.prototype.InitializeData.call(this, data);
	
	var self = this;
	// this.dbData.Events.OnMoveRecord.add(function(dataset, params) {
		// if(self.GridControl.FocusedRow) {
			// self.GridControl.FocusedRow.attr("focused", "0")
		// };
		
		// self.GridControl.FocusedRow = row;
		// row.attr("focused", "1");
	// });
};
	
SubPageTabular.prototype.InitializeGrid = function(grid) {
	SubPageTabular.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	var self = this;
	
	// grid.Events.OnInitRow.add(function(grid, row) {
		// if(grid.dataset.recNo == 0) {
			// grid.FocusedRow = row;
			// row.attr("focused", "1");
		// };
		
		// if(grid.dataset.get("row_no") % 2 !== 0) {
			// row.attr("odd", 1);
		// };
		
		// row.attr("row-id", grid.dataset.get(grid.dataset.primaryKey));
		
		// row.click(function() {
			// if(grid.FocusedRow) {
				// grid.FocusedRow.attr("focused", "0")
			// };
			
			// grid.FocusedRow = row;
			// row.attr("focused", "1");
			// if(grid.dataset.gotoKey(grid.FocusedRow.attr("row-id"))) {
			// };
		// });
	// });	
	
	grid.Events.OnCommand.add(function(grid, params) {
		// Expecting params.cell, params.command
		if(params.command == "editx") {
			self.Edit(params.cell.parent().attr("row-id"), params.cell);
		} else if(params.command == "deletex") {
			self.Delete(params.cell.parent().attr("row-id"), params.cell);
			// self.dbEdit.Events.OnTryDeleteRecord.trigger({id:params.cell.parent().attr("row-id"), target:params.cell});
		}
	});
	
	grid.Events.OnInitColumnCell.add(function(grid, params) {
		if(params.column.allowSort) {
			// if(params.cell.attr("sorted") == "1") {
			if(self.dbSearch.get("sort") == params.column.fname) {
				// params.cell.css("background-color", "#C7EEC7");
			}
		};
	});
	
	grid.Events.OnInitColumns.add(function(grid) {
	// this.Permission.Edit = data.crud & 2 & this.Rights.Edit;
	// this.Permission.Delete = (data.crud & 4) & this.Rights.Delete;
		if(self.Permission.Edit || self.Permission.Delete) grid.NewBand("...");
		if(self.Permission.Edit) grid.NewCommand({command: "editx", width: 30});
		if(self.Permission.Delete) grid.NewCommand({command: "deletex", width: 30});
	});
};
