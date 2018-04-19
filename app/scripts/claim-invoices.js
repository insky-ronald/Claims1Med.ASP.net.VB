// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: invoices.js
//==================================================================================================
function CreateSubPage(params){
	return new Invoices(params)
};

Class.Inherits(Invoices, Services);
function Invoices(Params) {
	Invoices.prototype.parent.call(this, Params);
};

Invoices.prototype.classID = "Invoices";
Invoices.prototype.dataSource = "claim-invoices";

Invoices.prototype.InitializeTableData = function(data) {
	Invoices.prototype.parent.prototype.InitializeTableData.call(this, data);
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true})
		.setprops("pin", {label:"PIN"})
		.setprops("name", {label:"Name"})
		.setprops("currency_code", {label:"Currency"})
		.setprops("country", {label:"Country"})
};

Invoices.prototype.InitializeColumns = function(grid) {
	Invoices.prototype.parent.prototype.InitializeColumns.call(this, grid);
	grid.NewCommand({command:"open", float: "left"});
	
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
};
