// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-actions.js
// uses edit-action.js
//==================================================================================================
function ActionsView(viewParams){
	var name = "engine/sys-actions";
	var requestParams = viewParams.requestParams;
	
	return new JDBGrid({
		params: viewParams,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-actions"
		},
		editForm: function(id, container, dialog) {
			ActionEdit({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
				// customData: {
					// owner_id: requestParams.owner_id
				// }
			})
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Action",
					message: ('Please confirm to delete action "<b>{0}</b>"').format(grid.dataset.lookup(id, "action_name"))
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
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
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
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
						.setprops("action_name", {label:"Action"})
						.setprops("description", {label:"Description"})
						// .setprops("rights", {label:"Rights"})
						.setprops("rights", {label:"Rights",
							getText: function(column) {
								if(column.raw()) {
									var names = column.raw().split(",");
									var container = CreateElement("div");
									var items = CreateElement("ul", container).attr("x-rights", "1")
									for(var i = 0; i < names.length; i++) {
										var name = CreateElement("li", items).html(names[i].trim());
									};
									
									return container.html();
								} else
									return ""
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
					row.attr("x-type", grid.dataset.get("action_type_id"))
					row.attr("x-app-id", grid.dataset.get("application_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "position", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "action_name", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "description", width: 300, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "rights", width: 300, allowSort: false, fixedWidth:false});
				});
				
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.NewItem({
						// id: "save",
						// icon: "db-save",
						// iconColor: "red",
						// hint: "Save",
						// dataBind: grid.dataset,
						// dataEvent: function(dataset, button) {
							// console.log("ok");
							// button.show(!dataset.editing);
							// button.show(false);
							// self.Events.OnDataEvent.trigger();
						// },
						// click: function(item) {
							// console.log("here");
							// self.Events.OnPost.trigger();
						// }
					// });
				// });
			});
		}
	});	
};
