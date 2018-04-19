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
}

jGridColumn.prototype.classID = "jGridColumn"

jGridColumn.prototype.painterClass = undefined
jGridColumn.prototype.paintImediately = false
// jGridColumn.prototype.headerPainterClass = jGridHeaderPainter
// jGridColumn.prototype.dataPainterClass = jGridDataPainter
// jGridColumn.prototype.painterClass = jGridColumnPainter

jGridColumn.prototype.initialize = function(params) {
    jGridColumn.prototype.parent.prototype.initialize.call(this, params)
	
    this.grid = params.owner
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
}
