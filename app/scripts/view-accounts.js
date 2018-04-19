// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-accounts.js
// uses edit-account.js
//==================================================================================================
function AccountsView(params){
	var name = "accounts";
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: name
		},
		editForm: function(id, container, dialog) {
			AccountEdit({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Account",
					message: ('Please confirm to delete "<b>{0}</b>"').format(grid.dataset.lookup(id, "description"))
				}
			});

			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "seq_no")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						.addColumn("owner_id", 1)
						.addColumn("type", -1)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("seq_no", {label:"#", numeric:true})
						.setprops("type", {label:"Type", numeric:true})
						.setprops("code", {label:"Code"})
						.setprops("description", {label:"Description"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-type", grid.dataset.get("type"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "seq_no", width: 50, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "description", width: 400, allowSort: true});
					grid.NewColumn({fname: "type", width: 50, allowSort: false, fixedWidth:true});
				});
			});
		}
	});	
};
