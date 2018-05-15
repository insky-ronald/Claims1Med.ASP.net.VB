// ****************************************************************************************************
// File name: view-schedule-history.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function ScheduleHistoryView(params){
	function MasterKey() {
		if(params.getMasterID) {
			return params.getMasterID()
		} else {
			return params.requestParams.plan_code
		}
	};
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "schedule-history",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ScheduleHistoryEdit({
				url: ("?id={0}&plan_code={1}").format(id, MasterKey()),
				container: container,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "schedule-history";
				// grid.options.editNewPage = true;
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.showPager = false;
				grid.search.visible = false;
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("plan_code", MasterKey(), {numeric:true})
						// .addColumn("sort", "street")
						// .addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("start_date", {label:"Start Date", type:"date"})
						.setprops("end_date", {label:"End Date", type:"date"})
						.setprops("view", {label:"Schedule of Benefits", 
							getText: function() {
								return "View.."
							}
						})
						// .setprops("street", {label:"Street"})
						// .setprops("city", {label:"City"})
						// .setprops("country", {label:"Country"})
						// .setprops("address_type_name", {label:"Type"})
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-current", grid.dataset.get("is_current") ? "1" : "0")
				});
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "current")
						return "override"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandIcon", function(grid, column, defaultValue) {
					if(column.command === "current")
						return "override"
					else
						return defaultValue
				});
		
				// grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					// if(column.command === "default")
						// return "Set as default address"
					// else
						// return defaultValue
				// });

				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "current")
						return grid.dataset.get("is_current")
					else
						return defaultValue
				});
				
				grid.methods.add("getLinkUrl", function(grid, params) {
					if(params.column.linkField === "id") {
						return __sob(params.id, true)
					} else {
						return ""
					}
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"} , function(band) {
						band.NewCommand({command:"current"});
					});
					
					grid.NewColumn({fname: "start_date", width: 150, fixedWidth:true});
					grid.NewColumn({fname: "end_date", width: 150, fixedWidth:true});
					grid.NewColumn({fname: "view", width: 200, fixedWidth:true, linkField:"id"});
				});
				
				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// return {
						// title: "Delete Address",
						// message: ('Please confirm to delete address.')
					// }
				// })
			})
		}
	}))
};
