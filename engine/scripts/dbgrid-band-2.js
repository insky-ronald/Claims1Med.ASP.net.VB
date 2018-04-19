// *************************************************************************************************
// File name: dbgrid-columns-2.js
// Last modified on
// 15-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jGridBand
//**************************************************************************************************
//**************************************************************************************************
Class.Inherits(jGridBand, jControl)
function jGridBand(params) {
    jGridBand.prototype.parent.call(this, params)
}

jGridBand.prototype.classID = "jGridBand"

// jGridBand.prototype.painterClass = jGridBandPainter
jGridBand.prototype.painterClass = jGridBandPainter3
jGridBand.prototype.paintImediately = false

jGridBand.prototype.initialize = function(params) {
    jGridBand.prototype.parent.prototype.initialize.call(this, params)
	this.NewColumn = this.newColumn // for backward compatibility
	this.NewCommand = this.newCommand// for backward compatibility
	this.NewBand = this.newBand // for backward compatibility
	
	this.bands = new JList()
	this.columns = new JList()
	
    this.filler = defaultValue(params.filler, false)
    this.grid = params.owner
    this.band = params.band
	if(params.band) 
		this.level = params.band.level + 1
	else
		this.level = 1
		
	this.caption = defaultValue(params.caption, "")
	this.fixed = defaultValue(params.fixed, "middle")
}

jGridBand.prototype.newBand = function(params, callback) {
	params.owner = this.grid
	params.band = this

	var band = this.grid.createBand(params)
	if(callback) callback(band)
		
	return this.bands.add(params.id, band)
}

jGridBand.prototype.newColumn = function(params) {
	params.owner = this.grid
	params.band = this
	
	var column = this.grid.createColumn(params)
	
	this.columns.add(params.fname, column)

	return column
}

jGridBand.prototype.newCommand = function(params) {
	return this.newColumn(params)
}

jGridBand.prototype.levelCount = function() {
	var maxCount = 0
	
	var gather = function(band, count) {
		maxCount = band.level > maxCount ? band.level: maxCount
		band.bands.each(function(i, band) {
			gather(band, count)
		})
	}
	
	this.bands.each(function(i, band) {
		gather(band, maxCount)
	})
	
	return maxCount
}
