// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: clients.js
//==================================================================================================
function CreateSubPage(params){
	return new Dashboard(params)
};

Class.Inherits(Dashboard, SubPageData);
function Dashboard(Params) {
	Dashboard.prototype.parent.call(this, Params);
};

Dashboard.prototype.classID = "Dashboard";
Dashboard.prototype.showHeader = false;
Dashboard.prototype.showFooter = false;
Dashboard.prototype.dataSource = "dashboard";

Dashboard.prototype.Initialize = function(Params) {
	Dashboard.prototype.parent.prototype.Initialize.call(this, Params);
};

Dashboard.prototype.CreateWidget = function(size, init) {
	var widget = CreateElement("div", this.Painter.content).addClass("widget").attr("x-size", size);
	var content = CreateElement("div", widget).attr("x-sec", "container");
	
	init(content);
};

Dashboard.prototype.DrawIcon = function(icon, widget) {
	var c = CreateElement("div", widget).attr("x-sec", "icon")
	desktop.GetSvg(c, icon, 32);
};

Dashboard.prototype.Paint = function() {
	Dashboard.prototype.parent.prototype.Paint.call(this);
	this.Painter.content.addClass("dashboard");
	var self = this;
	
	this.CreateWidget(4, function(widget) {
		widget.parent().css("height", 120);
	});
	
	this.CreateWidget(4, function(widget) {
		widget.parent().css("height", 120);
	});
	
	this.CreateWidget(4, function(widget) {
		widget.parent().css("height", 120);
	});
	
	this.CreateWidget(4, function(widget) {
		widget.parent().css("height", 120);
	});
	
	this.CreateWidget(2, function(widget) {
		// widget.addClass("icons");
		widget.parent().css("height", 300);
		// self.DrawIcon("tree-expand", widget);
		// self.DrawIcon("tree-collapse", widget);
		// self.DrawIcon("table", widget);
		// self.DrawIcon("table-edit", widget);
		// self.DrawIcon("home", widget);
		// self.DrawIcon("calendar-blank", widget);
		
		
		// var h = CreateElement("div", widget).attr("x-sec", "header");		
		// desktop.GetSvg(h, "home", 21, {noTopMargin: true});
		// var l = CreateElement("span", h).attr("x-sec", "title").html("Useful links")
		
		// var c = CreateElement("div", widget).attr("x-sec", "content")
		
		// CreateElement("a", c).attr("target", "_blank").attr("href", "/nav/admin").html("Administration")
		// CreateElement("a", c).attr("target", "_blank").attr("href", "/nav/providers").html("Providers")
		// CreateElement("a", c).attr("target", "_blank").attr("href", "/nav/tables").html("Tables")
		// CreateElement("a", c).attr("target", "_blank").attr("href", "/nav/claim/70017534").html("Open Claim")
		// desktop.GetSvg(l, "table", 21, {noTopMargin: true});
		// desktop.GetSvg(l, "table", 21);
	});
	
	this.CreateWidget(2, function(widget) {
		widget.parent().css("height", 300);
	});
	
	this.CreateWidget(2, function(widget) {
		widget.parent().css("height", 300);
		// widget.css("padding", 10);
		// widget.css("overflow", "hidden");
		// widget.css("overflow-y", "auto");
		
		// var c = CreateElement("div", widget)
			// .css("width", 600)
			// .css("height", 600)
			// .css("background", "wheat");
			
		// var myScroll = new IScroll(widget[0], {
				// scrollbars: true,
				// mouseWheel: true,
				// interactiveScrollbars: true,
				// shrinkScrollbars: false,
				// fadeScrollbars: true,
				// momentum: false
			// });			
	});
	
	this.CreateWidget(2, function(widget) {
		widget.parent().css("height", 300);
	});
	
	// this.CreateWidget(3, function(widget) {
		// widget.parent().css("height", 200);
	// });
	
	// this.CreateWidget(3, function(widget) {
		// widget.parent().css("height", 200);
	// });
	
	// this.CreateWidget(3, function(widget) {
		// widget.parent().css("height", 200);
	// });
};

Dashboard.prototype.Paintx = function() {
	Dashboard.prototype.parent.prototype.Paint.call(this);
	this.Painter.content.addClass("dashboard");
	
	var widgetContainer = CreateElement("div", this.Painter.content)
		.attr("x-sec", "dataview");
		
	var gridContainer = CreateElement("div", widgetContainer)
		.attr("x-sec", "gridview");
		
	var formContainer = CreateElement("div", widgetContainer)
		.attr("x-sec", "formview");
	
	this.grid = new JDBGrid({
		owner: this,
		container: gridContainer,
		options: {
			horzScroll: false
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "clients";
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "name";
				// grid.optionsData.editCallback = function(grid, id) {
					// __client(id);
				// };

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
				
				grid.Methods.add("canAdd", function(grid) {
					return grid.owner.rights.add;
					// return false;
				});
				
				grid.Methods.add("canEdit", function(grid) {
					return grid.owner.rights.edit;
					// return false;
				});
				
				grid.Methods.add("canDelete", function(grid) {
					// return grid.owner.rights["delete"];
					return false;
				});
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					// grid.owner.InitializeQuery(dataParams);
					dataParams
						.addColumn("name", "")
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "pin")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					// grid.owner.InitializeTableData(data);
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("pin", {label:"PIN"})
						.setprops("name", {label:"Name"})
						.setprops("currency_code", {label:"Currency"})
						.setprops("country", {label:"Country"})
				});
					
				grid.Events.OnInitEditData.add(function(grid, data) {
					// grid.owner.InitializeEditData(data);
				});
				
				grid.Events.OnInitEditor.add(function(grid, editor) {
					// grid.owner.InitializeEditor(editor);
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.owner.InitializeColumns(grid);
					// grid.NewCommand({command:"open", float: "left"});
					grid.InitBands("Client", function(band) {
						band.InitBands("PIN and Name", function(band) {
							band.InitBands("1", function(band) {
								band.NewColumn({fname: "pin", width: 100, allowSort: true});
							});
							
							band.InitBands("2", function(band) {
								band.NewColumn({fname: "name", width: 300, allowSort: true});
							});
						})
						band.InitBands("Currency and Country", function(band) {
							band.NewColumn({fname: "currency_code", width: 100});
							band.NewColumn({fname: "country", width: 200});
						});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		},
		Painter: {
			css: "clients"
		}
	});

	this.pgEditor = new JPageControl({
		owner: this,
		container: formContainer,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: false
		},
		init: function(pg) {
			// alerts(editor.classID)
			
			var editorInit = {
				PageControl: pg,
				NewGroupEdit: function(caption, callback) {
					pg.NewTab(caption, {
						OnCreate: function(tab) {
							tab.content.parent().css("padding", 10);
							var container = CreateElement("div", tab.content).addClass("editor-tab-container-full")
								
							var editor = new JEditor({
								ID: "edit_" + tab.id,
								Container: container,
								Css: "editor"
							});	          
							
							// editor.Dataset = self.Control.editData;
							
							callback(editor, tab);
							
							editor.Paint();
							editor.AfterPaint();
							// editor.Dataset.updateControls();
						}
					});
				},
				NewContainer: function(caption, callback) {
					pg.NewTab(caption, {
						OnCreate: function(tab) {
							callback(CreateElement("div", tab.content).css("width", "100%"), tab);
						}
					});
				}
			};
			
			editorInit.NewGroupEdit("Client", function(editor, tab) {
				// editor.AddEdit({ID: "id"});
				// editor.AddEdit({ID: "pin"});
				// editor.AddEdit({ID: "name"});
				// editor.AddLookup("currency_code", {width: 400,height: 250,init: CurrencyLookup});
				// editor.AddEdit({ID: "currency_code"});
			});
			
			// pg.owner.Painter.InitializeEditor(pg);
		}
	});	
};

Dashboard.prototype.AfterPaint = function() {
	Dashboard.prototype.parent.prototype.AfterPaint.call(this);
};
