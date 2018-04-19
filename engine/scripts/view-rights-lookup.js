// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-rights-lookup.js
//==================================================================================================
function RightsLookupView(params){
	var name = "engine/sys-rights";
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-rights"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name+"?lookup=1";
				if(params.selectionColumn)
					grid.InitSelections(params.selectionColumn.dataset.get(params.selectionColumn.fname));
				
				// grid.optionsData.cache = true;
				grid.options.lookup = !params.selectionColumn;
				grid.options.showToolbar = true;
				grid.options.toolbarTheme = "svg";
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = params.selectionColumn;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("page", 1, {numeric:true})
						// .addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "position")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						// .addColumn("owner_id", 1)
						// .addColumn("type", -1)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("rights", {label:"Rights"})
						// .setprops("description", {label:"Description"})
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "rights", width: 150, allowSort: true, fixedWidth:false});
					// grid.NewColumn({fname: "description", width: 0, allowSort: true});
				});

				if(params.selectionColumn)
					grid.Events.OnSelect.add(function(grid, selection) {
						params.selectionColumn.dataset.set(params.selectionColumn.fname, selection.join(","));
					});
			});
		}
	});	
};
