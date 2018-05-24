// *************************************************************************************************
// File name: dbgrid-columns-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridColumnColumn
//**************************************************************************************************
//**************************************************************************************************
Class.Inherits(jGridColumn, jControl)
function jGridColumn(params) {
    jGridColumn.prototype.parent.call(this, params)
};

jGridColumn.prototype.classID = "jGridColumn"

jGridColumn.prototype.painterClass = undefined
jGridColumn.prototype.paintImediately = false
// jGridColumn.prototype.headerPainterClass = jGridHeaderPainter
// jGridColumn.prototype.dataPainterClass = jGridDataPainter
// jGridColumn.prototype.painterClass = jGridColumnPainter

jGridColumn.prototype.initialize = function(params) {
    jGridColumn.prototype.parent.prototype.initialize.call(this, params)
	
    this.grid = params.owner
    this.permission = params.permission
    this.band = params.band
    this.internal = params.internal
    this.command = params.command
	this.width = params.width
	this.fname = params.fname
	this.caption = defaultValue(params.caption, params.fname)
	this.drawHeader = params.drawHeader
	this.drawContent = params.drawContent
	this.drawSummary = params.drawSummary
	this.showFooter = params.showFooter
	this.fixedWidth = defaultValue(params.fixedWidth, false)
	this.showSummary = defaultValue(params.showSummary, false)
	this.treeView = defaultValue(params.treeView, false)
	this.allowSort = defaultValue(params.allowSort, false)
	this.linkField = defaultValue(params.linkField, "")
	this.linkUrl = defaultValue(params.linkUrl, "")

	if(!this.command) {
		if (params.allowSort === undefined)
			this.allowSort = this.grid.options.allowSort
		else
			this.allowSort = params.allowSort
		
		if (params.allowFilter === undefined)
			this.allowFilter = this.grid.options.allowFilter
		else
			this.allowFilter = params.allowFilter
	}
	
	this.float = defaultValue(params.float, "none")
	
	// this.debug(this)
};

jGridColumn.prototype.openDropDown = function(params) {
	// console.log(params)
	params.container.data("object", {icon:params.icon, size:18});
	var dialog = new JPopupDialog({
		Target: params.container,
		Modal: false,
		// onClose: params.onClose,
		Painter: {
			painterClass: PopupOverlayPainter,
			color: params.color,
			snap: "bottom",
			align: "left",
			noIndicator: false,
			OnRenderHeader: function(dialog, container) {
			},
			OnRenderContent: function(dialog, container) {
				CreateElementEx("div", container, function(header) {
					CreateElement("h2", header).html(params.title).css("margin", 0);
					if (params.subTitle) {
						CreateElement("p", header).html(params.subTitle);
					}
				});			
				
				CreateElementEx("div", container, function(view) {
					view.parent()
						.css("width", params.width || 600)
						
					view
						.css("height", params.height || 300)
						.css("border", "1px solid " + params.color);
						
					if(params.view) {
						params.view($.extend({}, {container:view, 
							initParams:function(dataParams) {
								// console.log("here")
								if (params.initParams) {
									params.initParams(dataParams);
								}
							},
							select:function(key) {
								dialog.Hide();
								desktop.HideHints();
								params.select(key);
							}
						}));						
					};
				});
			},
			OnRenderFooter: function(dialog, container) {
				CreateButton({
					container: container,
					caption: "Close",
					style: "green",
					click: function(button) {
						dialog.Hide();
					}
				});
			}
		}
	});
	
};
