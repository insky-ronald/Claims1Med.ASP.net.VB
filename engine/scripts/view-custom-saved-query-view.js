// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-custom-saved-query-view.js
//==================================================================================================
Class.Inherits(jCustomSavedQueryView, jControl);
function jCustomSavedQueryView(params) {
    jCustomSavedQueryView.prototype.parent.call(this, params);
};

jCustomSavedQueryView.prototype.classID = "jCustomSavedQueryView";
jCustomSavedQueryView.prototype.viewCss = "authorisation";
jCustomSavedQueryView.prototype.viewUrl = "app/claims-authorisation";
jCustomSavedQueryView.prototype.searchWidth = 550;
jCustomSavedQueryView.prototype.exportName = "Claims Authorisation";
jCustomSavedQueryView.prototype.exportSource = "DBClaims.GetClaimsAuthorisation";
jCustomSavedQueryView.prototype.popuMenuTitle = "Authorisation";

jCustomSavedQueryView.prototype.initialize = function(params) {
	jCustomSavedQueryView.prototype.parent.prototype.initialize.call(this, params);
};

jCustomSavedQueryView.prototype.OnInitGrid = function(grid) {
};

jCustomSavedQueryView.prototype.OnInitDataRequest = function(dataset) {
	dataset
		.addColumn("loaded", 0, {numeric:true})
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "")
		.addColumn("order", "asc");
		
	dataset.Methods.add("excludeInClearSearch", function(dataset, params, previous) {
		return ["id","loaded"].concat(previous);
	});		
};

jCustomSavedQueryView.prototype.OnInitSearchData = function(dataset) {	
};

jCustomSavedQueryView.prototype.OnInitSearchEditor = function(editor) {
};

jCustomSavedQueryView.prototype.OnInitData = function(dataset) {
};

jCustomSavedQueryView.prototype.OnInitSummaryData = function(dataset) {
};

jCustomSavedQueryView.prototype.OnInitRow = function(row) {
};

jCustomSavedQueryView.prototype.OnInitMethods = function(grid) {
};

jCustomSavedQueryView.prototype.OnPopupMenuCommands = function(menu) {
};

jCustomSavedQueryView.prototype.OnPopupMenu = function(menu) {
};

jCustomSavedQueryView.prototype.addFilterDisplay = function(info) {
	var container = this.displayFilterContainer || info.container;
	if(info.displayText) {
		var formatText = "<a x-sec='name'>{0}</a>";
		if(container.html()) formatText = ("<a x-sec='operator2'>and</a> {0}").format(formatText);
		
		container.append(formatText.format(info.displayText));
	} else if(this.grid.dataParams.raw(info.name)) {
		// var container = this.displayFilterContainer || info.container;
		if(info.displayText) {
			var formatText = "<a x-sec='name'>{0}</a>";
			container.append(formatText.format(info.displayText));
		} else {
			var formatText = "<a x-sec='name'>{0}</a> <a x-sec='operator'>{1}</a> <a x-sec='value'>{2}</a>"
			
			if(container.html()) formatText = ("<a x-sec='operator2'>and</a> {0}").format(formatText);
			
			formatText = ("<span x-sec='item'>{0}</span>").format(formatText);
			
			container.append(formatText.format(info.caption, info.operator, this.grid.dataParams.get(info.name)));
		}
	}
};

jCustomSavedQueryView.prototype.OnDrawCustomHeader = function(container) {
	var self = this;
	CreateElementEx("div", container, function(queryContainer) {							
		CreateElementEx("div", queryContainer, function(icon) {							
			// desktop.svg.draw(icon, "filter", 16).attr("x-icon", "info")
			desktop.svg.draw(icon, "magnify", 22).attr("x-icon", "info")
		});
		
		CreateElementEx("div", queryContainer, function(container) {							
			self.displayFilterContainer = CreateElementEx("div", container, function(text) {
			});
		});
	}, "query-container");
};

jCustomSavedQueryView.prototype.OnInitColumns = function(grid) {
};

jCustomSavedQueryView.prototype.OnInitToolbar = function(toolbar) {
};

jCustomSavedQueryView.prototype.paint = function() {
	jCustomSavedQueryView.prototype.parent.prototype.paint.call(this);
	
	var self = this;

	this.grid = new jGrid($.extend(this.params, {
		paintParams: {
			css: this.viewCss+" saved-query",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = self.viewUrl;
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = true;
				grid.options.showPopupMenu = true;
				grid.options.showSummary = true;
				grid.options.showCustomHeader = true;
				
				grid.search.visible = true;
				grid.search.mode = "advanced";
				grid.search.searchWidth = self.searchWidth;
				
				grid.exportData.allow = true;
				grid.exportData.name = self.exportName;
				grid.exportData.source = self.exportSource;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					self.OnInitDataRequest(dataParams);
				});
				
				grid.Events.OnInitSubData.add(function(grid, params) {
					if(params.index === 1) {
						if(grid.footerData)
							grid.footerData.resetData(params.rawData)
						else
							grid.footerData = new Dataset(params.rawData, "Footer Data");
						
						self.OnInitSummaryData(grid.footerData)
					} else if(params.index === 2 && !grid.dataParams.resetAlready) {
						grid.dataParams.resetAlready = true;
						grid.dataParams.resetData(params.rawData);
					}
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					self.OnInitData(data);
				});
				
				self.OnInitSearchData(grid.dataParams);
				
				grid.events.OnInitSearch.add(function(grid, editor) {
					// editor.Events.OnInitData.add(function(sender, data) {
						// console.log("3b")
						// self.OnInitSearchData(data);
					// });
					
					editor.Events.OnInitEditor.add(function(sender, editor) {
						self.OnInitSearchEditor(editor);
					});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {
					self.OnInitRow(row);
				});	
				
				self.OnInitMethods(grid);
				
				grid.Events.OnPopupMenu.add(function(grid, menu) {
					self.OnPopupMenu(menu);
				});
				
				grid.Events.OnDrawCustomHeader.add(function(grid, container) {	
					self.OnDrawCustomHeader(container);
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					self.OnInitColumns(grid);
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					self.OnInitToolbar(toolbar);
				});
				
				self.OnInitGrid(grid);
			});
		}
	}));
};
