// *************************************************************************************************
// File name: dbgrid-column-painters-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridSectionPainter
//**************************************************************************************************
Class.Inherits(jGridSectionPainter, jBasePainter);
function jGridSectionPainter(params) {
	jGridSectionPainter.prototype.parent.call(this, params);
};

jGridSectionPainter.prototype.type = "grid";
jGridSectionPainter.prototype.classID = "jGridSectionPainter";

jGridSectionPainter.prototype.initialize = function(params) {
    jGridSectionPainter.prototype.parent.prototype.initialize.call(this, params);
	
    this.headerContainer = params.header
    this.contentContainer = params.content
    this.footerContainer = params.footer
    // this.fixed = defaultValue(params.fixed, "middle")
    this.fixed = params.fixed
};

jGridSectionPainter.prototype.paint = function(container) {
    jGridSectionPainter.prototype.parent.prototype.paint.call(this, container);
	
	// this.header = CreateElement("div", this.headerContainer, "", "")
		// .attr("grid-sec", "left-header-container")
		
	// this.content = CreateElement("div", this.contentContainer, "", "")
		// .attr("grid-sec", "left-container")
}

jGridSectionPainter.prototype.paintHeader = function(container) {
	this.header = CreateElement("div", container, "", "")
		.attr("grid-sec", this.fixed+"-container")
		
	// testing, remove later
	// CreateElement("div", this.header, "", this.fixed+"-header-container-test")	
		
	return this.header
}

jGridSectionPainter.prototype.paintFooter = function(container) {
	this.footer = CreateElement("div", container, "", "")
		.attr("grid-sec", this.fixed+"-container")
		
	// testing, remove later
	// CreateElement("div", this.footer, "", this.fixed+"-footer-container-test")	
		
	return this.footer
}

jGridSectionPainter.prototype.paintContent = function(container) {
	this.content = CreateElement("div", container, "", "")
		.attr("grid-sec", this.fixed+"-container")

	// testing, remove later
	// CreateElement("div", this.content, "", this.fixed+"-container-test")
		
	return this.content
}

jGridSectionPainter.prototype.width = function() {
	return this.content.outerWidth()
	// return this.content.width()
}

jGridSectionPainter.prototype.scroll = function(value) {
	if(this.fixed === "middle") {
		// console.log(value)
		if(this.header)
			this.header.scrollLeft(value)
		
		if(this.footer)
			this.footer.scrollLeft(value)
	} else {
		this.content.css(value)
	}
}
