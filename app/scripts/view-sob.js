// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sob.js
//==================================================================================================
function SobView(params){
	return new JDBTreeView({
		params: params,
		Painter: {
			css: "currencies"
		},
		treeViewSettings: {
			key: "id",
			parent: "parent_id",
			getLevel: function(column) {
				return column.dataset.raw("level")
			},
			hasChildren: function(grid) {
				return grid.dataset.raw("item_count") > 0;
			},
			preInitColumn: function(column, c) {
				// if(grid.dataset.raw("limit_id") == 0) {
					// var hasNotes = grid.dataset.text("notes") == "" ? 0 : 1;
					// var hasLimits = grid.dataset.raw("limit_count") == 0 ? 0 : 1;
					// c.push(("<span x-sec='notes' x-type='{0}'}></span>").format(hasNotes);
					// c.push(("<span x-sec='limits' x-type='{0}'}></span>").format(hasLimits);
				// } else {
					// c.push("<span x-sec='limit'}></span>");
				// };
				
				// c.push("<span x-sec='edit'}></span>");
			},
			postInitColumn: function(column, c) {
				// if(grid.dataset.text("unit_required")) {
					// c.push(("<span x-sec='unit'>{0}</span>").format(grid.dataset.text("unit_spec")));
				// };
			},
			initColumn: function(column, cell) {
				// cell.find("span[x-sec='notes'][x-type='1']")
					// .each(function(i, o) {   
						// grid.page.SetHint($(o), grid.dataset.text("notes").replace(/\r\n|\n|\r/g, '<br>'));
					// });
			}
		},
		init: function(grid) {
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "sob";
				grid.optionsData.cache = false;
				
				grid.options.showToolbar = true;
				grid.options.toolbarTheme = "svg";
				
				grid.options.horzScroll = false;
				// grid.options.showPager = true;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = false;
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
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("benefit_name", {label:"Benefit", required:true})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewTreeViewColumn({fname: "benefit_name", width: 400, allowSort: false});
				});
			});
		}
	});	
};
