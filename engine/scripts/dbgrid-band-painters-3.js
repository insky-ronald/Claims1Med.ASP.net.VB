// *************************************************************************************************
// File name: dbgrid-column-painters-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridBandPainter3
//**************************************************************************************************
Class.Inherits(jGridBandPainter3, jBasePainter)
function jGridBandPainter3(params) {
	jGridBandPainter3.prototype.parent.call(this, params)
}

jGridBandPainter3.prototype.type = "grid"
jGridBandPainter3.prototype.classID = "jGridBandPainter3"

jGridBandPainter3.prototype.initialize = function(params) {
    jGridBandPainter3.prototype.parent.prototype.initialize.call(this, params)
}

jGridBandPainter3.prototype.paint = function() {
    jGridBandPainter3.prototype.parent.prototype.paint.call(this)

	var section = this.control.fixed
	
	var headerContainer
	var contentContainer
	var footerContainer
	
	// if(section === "middle") {
		// headerContainer = this.control.grid.painter.sections.header.content
		// contentContainer = this.control.grid.painter.sections.body.content
		// footerContainer = this.control.grid.painter.sections.footer.content
	// } else 
	if(section === "left") {
		headerContainer = this.control.grid.painter.sections.header.left
		contentContainer = this.control.grid.painter.sections.body.left
		footerContainer = this.control.grid.painter.sections.footer.left
	} else if(section === "right") {
		headerContainer = this.control.grid.painter.sections.header.right
		contentContainer = this.control.grid.painter.sections.body.right
		footerContainer = this.control.grid.painter.sections.footer.right
	} else {
		headerContainer = this.control.grid.painter.sections.header.content
		contentContainer = this.control.grid.painter.sections.body.content
		footerContainer = this.control.grid.painter.sections.footer.content
	};
	
	// console.log(contentContainer)
	
	this.headerTable = new jTable({container:headerContainer, band:this.control, mainSection:section, section: section+"-header", paintParams: {painterClass: jTableHeaderPainter}})
	if(this.control.grid.options.viewType == "cardview")
		this.contentTable = new jTable({container:contentContainer, band:this.control, mainSection:section, section: section+"-content", paintParams: {painterClass: jCardViewPainter}})
	else
		this.contentTable = new jTable({container:contentContainer, band:this.control, mainSection:section, section: section+"-content", paintParams: {painterClass: jTableContentPainter}})
	this.footerTable = new jTable({container:footerContainer, band:this.control, mainSection:section, section: section+"-footer", paintParams: {painterClass: jTableFooterPainter}})
	
	var self = this;
	if(contentContainer)
		contentContainer
			.on("mouseleave", function() {
				self.control.grid.bands.each(function(i, band) {
					band.painter.mouseLeave()
				})
				// console.log("leave")
				// self.headerTable.painter.mouseLeave()
				// self.contentTable.painter.mouseLeave()
				// self.footerTable.painter.mouseLeave()
				// self.control.bands.each(function(i, band) {
					// band.painter.mouseLeave()
				// })
			})
	
}

jGridBandPainter3.prototype.update = function() {
	this.contentTable.painter.update()
	this.footerTable.painter.update()
}

jGridBandPainter3.prototype.mouseLeave = function() {
	this.contentTable.painter.mouseLeave()
}

jGridBandPainter3.prototype.columnsWidth = function() {
	var width = 0
	
	this.control.columns.each(function(i, column) {
		if(column.fixedWidth)
			width += column.width
	})

	return width
}
