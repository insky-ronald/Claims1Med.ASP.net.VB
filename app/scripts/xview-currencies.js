// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-currencies.js
//==================================================================================================
function CurrenciesView(params){
	return new JDBGrid({
		params: params,
		Painter: {
			css: "currencies"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				
				grid.optionsData.url = "currencies";
				grid.optionsData.cache = true;
				
				grid.options.showToolbar = true;
				grid.options.toolbarTheme = "svg";
				
				grid.options.horzScroll = false;
				// grid.options.showPager = true;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = true;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 100000, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("name", {label:"Currency", required:true})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 200, allowSort: true});
					grid.NewColumn({fname: "name", width: 400, allowSort: true});
				});
			});
		}
	});	
};
