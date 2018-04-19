// ****************************************************************************************************
// File name: view-master-policies.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function AddressesView(params){
	var name_id = params.nameID ? params.nameID : params.requestParams.name_id;
	return new jGrid($.extend(params, {
		paintParams: {
			css: "addresses",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			AddressEdit({
				url: ("?id={0}&name_id={1}").format(id, name_id),
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
						.addColumn("name_id", name_id, {numeric:true})
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

				grid.Events.OnInitColumns.add(function(grid) {
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
				});
			});
		}
	});
};
