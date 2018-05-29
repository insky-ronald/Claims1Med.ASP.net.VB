// ****************************************************************************************************
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-users-lookup.js
//==================================================================================================
function UsersLookup(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "users",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				// grid.optionsData.url = "lookup?name=lookup_actions";
				grid.optionsData.url = "engine/sys-users";

				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showHeader = false;
				grid.options.showSelection = false;
				grid.options.showPager = true;
				grid.options.toolbar.visible = true;
				// grid.options.viewType = "treeview";
				// grid.options.treeViewSettings.keyColumnName = "id";
				// grid.options.treeViewSettings.parentColumnName = "parent_id";
				// grid.options.treeViewSettings.columnName = "description";

				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";

				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("sort", "full_name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
				});

				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {numeric:true, key: true})
						.setprops("user_name", {label:"User Name"})
						.setprops("full_name", {label:"Full Name"})

					if (viewParams.initData) {
						viewParams.initData(grid);
					}
				});

				grid.methods.add("canAdd", function() {
					return false
				});

				grid.methods.add("canEdit", function() {
					return false
				});

				grid.methods.add("canDelete", function() {
					return false
				});

				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});

				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select this note type"
				});

				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select({
						parentCode: grid.dataset.get("parent_code"),
						code: grid.dataset.get("code")
					});
				});

				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "select")
						return grid.dataset.get("parent_id") > 0
					else
						return true
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					if (grid.dataset.get("parent_id") == 0) {
						row.attr("x-parent", "1")
					} else {
						row.attr("x-parent", "0")
					}
				});

				grid.Events.OnTreeViewButtons.add(function(grid, params) {
					if(grid.dataset.get("parent_id") > 0 {
						params.addIcon({icon:"notes", name:"note"});
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					if (!viewParams.hideSelection) {
						grid.NewCommand({command:"select"});
					}

					grid.NewColumn({fname: "full_name", width: 400, fixedWidth:false});
					// grid.NewColumn({fname: "plan_name", width: 250, allowSort: true});
					// grid.NewColumn({fname: "product_name", width: 250, allowSort: true});
					// grid.NewColumn({fname: "client_name", width: 250, allowSort: true});
				});

			});
		}
	}));
};
