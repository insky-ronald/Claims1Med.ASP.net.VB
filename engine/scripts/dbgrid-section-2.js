// *************************************************************************************************
// File name: dbgrid-columns-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridSection
//**************************************************************************************************
//**************************************************************************************************
Class.Inherits(jGridSection, jControl)
function jGridSection(params) {
    jGridSection.prototype.parent.call(this, params)
}

jGridSection.prototype.classID = "jGridSection"
jGridSection.prototype.painterClass = jGridSectionPainter
// jGridSection.prototype.paintImediately = false

jGridSection.prototype.initialize = function(params) {
    jGridSection.prototype.parent.prototype.initialize.call(this, params)
    this.grid = params.owner
    this.header = params.header
    this.content = params.content
    this.footer = params.footer
    this.fixed = defaultValue(params.fixed, "none")		
}
