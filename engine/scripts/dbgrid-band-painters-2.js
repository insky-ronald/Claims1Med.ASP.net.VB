// *************************************************************************************************
// File name: dbgrid-column-painters-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridBandPainter
//**************************************************************************************************
Class.Inherits(jGridBandPainter, jBasePainter)
function jGridBandPainter(params) {
	jGridBandPainter.prototype.parent.call(this, params)
}

jGridBandPainter.prototype.type = "grid"
jGridBandPainter.prototype.classID = "jGridBandPainter"

jGridBandPainter.prototype.initialize = function(params) {
    jGridBandPainter.prototype.parent.prototype.initialize.call(this, params)
}

jGridBandPainter.prototype.paint = function() {
    jGridBandPainter.prototype.parent.prototype.paint.call(this)

	var section = this.control.fixed
	
	var headerContainer
	var contentContainer
	var footerContainer
	
	if(section === "middle") {
		headerContainer = this.control.grid.painter.middleSection.header
		contentContainer = this.control.grid.painter.middleSection.content
		footerContainer = this.control.grid.painter.middleSection.footer
	} else if(section === "left") {
		headerContainer = this.control.grid.painter.leftSection.header
		contentContainer = this.control.grid.painter.leftSection.content
		footerContainer = this.control.grid.painter.leftSection.footer
	} else if(section === "right") {
		headerContainer = this.control.grid.painter.rightSection.header
		contentContainer = this.control.grid.painter.rightSection.content
		footerContainer = this.control.grid.painter.rightSection.footer
	}
	
	this.headerTable = new jTable({container:headerContainer, band:this.control, mainSection:section, section: section+"-header", paintParams: {painterClass: jTableHeaderPainter}})
	this.contentTable = new jTable({container:contentContainer, band:this.control, mainSection:section, section: section+"-content", paintParams: {painterClass: jTableContentPainter}})
	this.footerTable = new jTable({container:footerContainer, band:this.control, mainSection:section, section: section+"-footer", paintParams: {painterClass: jTableFooterPainter}})
}

jGridBandPainter.prototype.update = function() {
	// this.log(this.contentTable)
	this.contentTable.painter.update()
}

jGridBandPainter.prototype.mouseLeave = function() {
	// this.headerTable.paintData()
	this.contentTable.painter.mouseLeave()
	// this.footerTable.paintData()
}

// jGridPainter.prototype.getCurrentKey = function() {
	// return this.contentTable
	// var id = parseInt(keyID)
	// this.control.bands.each(function(i, band) {
		// band.painter.contentTable.painter.focusRow(id)
	// })
// }

