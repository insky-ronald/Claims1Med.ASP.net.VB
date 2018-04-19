// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-rights.js
//==================================================================================================
function RightsView(viewParams){
	var name = "engine/sys-rights";
	var requestParams = viewParams.requestParams;
	
	return new JDBGrid({
		params: viewParams,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-rights"
		},
		editForm: function(id, container, dialog) {
			RoleEdit({
				id: id,
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
					title: "Delete Rights",
					message: ('Please confirm to delete rights "<b>{0}</b>"').format(grid.dataset.lookup(id, "rights"))
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "position")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						
					if(viewParams.requestParams.app_only)
						dataParams.addColumn("mode", 11)
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("position", {label:"Position", numeric:true})
						.setprops("code", {label:"Code"})
						.setprops("rights", {label:"Rights"})
						.setprops("description", {label:"Description"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
					row.attr("x-app-id", grid.dataset.get("application_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 50, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "position", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "code", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "rights", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "description", width: 300, allowSort: false, fixedWidth:false});
				});
			});
		}
	});	
};
