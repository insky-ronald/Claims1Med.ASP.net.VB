// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-clinics.js
//==================================================================================================
function ClinicsView(params){
	var name = "app/clinics";
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "clinics"
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
				
				grid.optionsData.editCallback = function(grid, id) {
					__clinic(id);
				};
				
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
						.setprops("name", {label:"Clinic Name"})
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

                    band = grid.NewBand("Clinic Details");
					band.NewColumn({fname: "id", width: 0, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "code", width: 100, allowSort: false, fixedWidth:true});
					band.NewColumn({fname: "name", width: 265, aloowSort: true, fixedWidth:true});
					band.NewColumn({fname: "discount", width: 80, allowSort: false, fixedWidth:true});
					
					band = grid.NewBand("Clinic Address");
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