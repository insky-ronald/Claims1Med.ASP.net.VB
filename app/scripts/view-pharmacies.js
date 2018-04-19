// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-pharmacies.js
//==================================================================================================
function PharmaciesView(params){
	var name = "app/pharmacies";
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "pharmacies"
		},
		init: function(grid) {			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("code", {label:"Code"})
						.setprops("name", {label:"Pharmacy Name"})
						.setprops("discount", {label:"Discount", numeric:true})
						.setprops("street", {label:"Street"})
						.setprops("city", {label:"City"})
						.setprops("province", {label:"Province"})
						.setprops("zip_code", {label:"Zip Code"})
						.setprops("country", {label:"Country"}) 
				});

				grid.Events.OnInitColumns.add(function(grid) {		
					grid.NewCommand({command: "open", float: "left"});
					
					var band;

                    band = grid.NewBand("Pharmacy Details");
					band.NewColumn({fname: "id", width: 0, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "code", width: 100, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "name", width: 265, aloowSort: true, fixedWidth:true});
					band.NewColumn({fname: "discount", width: 80, allowSort: false, fixedWidth:true});
					
					band = grid.NewBand("Pharmacy Address");
					band.NewColumn({fname: "street", width: 300, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "city", width: 300, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "province", width: 125, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "zip_code", width: 250, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "country", width: 150, fixedWidth:false, allowSort: true}); 
				});
			});
		}
	});	
};