// ****************************************************************************************************
// File name: view-addresses.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function AddressesView(params){
	function MasterKey() {
		if(params.getMasterID) {
			return params.getMasterID()
		} else {
			return params.requestParams.name_id
		}
	};
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "addresses",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			AddressEdit({
				url: ("?id={0}&name_id={1}").format(id, MasterKey()),
				container: container,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "addresses";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showPager = false;
				grid.search.visible = false;
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("name_id", MasterKey(), {numeric:true})
						.addColumn("sort", "street")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("street", {label:"Street"})
						.setprops("city", {label:"City"})
						.setprops("country", {label:"Country"})
						.setprops("address_type_name", {label:"Type"})
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_default"))
				});
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "override"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandIcon", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "override"
					else
						return defaultValue
				});
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "default")
						return "Set as default address"
					else
						return defaultValue
				});

				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "default")
						return grid.dataset.get("is_default") === 0
					else
						return defaultValue
				});

				grid.Events.OnCommand.add(function(grid, column) {
					if(column.command === "default") {
						// column.element is the cell container
						ConfirmDialog({
							color: "forestgreen",
							target: column.element,
							title: "Set Default",
							message: "Please confirm to set address as default.",
							callback: function(dialog) {
								desktop.Ajax(
									self, 
									"/app/api/command/set-default-address",
									{
										name_id: MasterKey(),
										address_id: grid.dataset.getKey()
									}, 
									function(result) {
										if (result.status == 0) {
											grid.refresh();
										} else {
											ErrorDialog({
												target: column.element,
												title: "Error: Set Default",
												message: result.message
											});
										}
									}
								)
							}
						});
					};
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({caption: "...", fixed:"left"} , function(band) {
						band.NewCommand({command:"default"});
					});
					
					grid.NewColumn({fname: "address_type_name", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "street", width: 250, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "city", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "country", width: 200, allowSort: true, fixedWidth:true});
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Address",
						message: ('Please confirm to delete address.')
					}
				})
			})
		}
	}))
};
