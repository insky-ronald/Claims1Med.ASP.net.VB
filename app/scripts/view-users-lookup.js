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
				grid.optionsData.url = "engine/sys-users";

				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showHeader = false;
				grid.options.showSelection = false;
				grid.options.showPager = true;
				grid.options.toolbar.visible = true;

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
					viewParams.select(grid.dataset.get("user_name"));
				});

				grid.Events.OnInitColumns.add(function(grid) {
					if (!viewParams.hideSelection) {
						grid.NewCommand({command:"select"});
					}

					grid.NewColumn({fname: "full_name", width: 400, fixedWidth:false});
				});

			});
		}
	}));
};
