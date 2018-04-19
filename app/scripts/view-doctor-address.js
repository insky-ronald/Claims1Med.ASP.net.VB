// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-doctor-address.js
// uses edit-doctor-address.js
//==================================================================================================
function DoctorAddressView(params){
	var name = "app/doctor-address";
	//var name_id = params.requestParams.doctor_id;
	var name_id = params.requestParams.name_id; //<<-- name_id is declared in main-doctors menu
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "doctor-address"
		},
		editForm: function(id, container, dialog) {
			AddressEdit({
				url: ("?id={0}&name_id={0}").format(id, name_id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog,
			})
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Doctor Address",
					message: ('Please confirm to delete doctor address?')
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				//grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				//grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				//grid.options.simpleSearch = true;
				//grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
					    .addColumn("name_id", name_id, {numeric:true})
						//.addColumn("page", 1, {numeric:true})
						//.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "id")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("address_type_name", {label:"Address Type"})
						.setprops("street", {label:"Street"})
						.setprops("city", {label:"City"})
						.setprops("province", {label:"Province"})
						.setprops("zip_code", {label:"Zip Code"})
						.setprops("country", {label:"Country"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_default"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 0, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "address_type_name", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "street", width: 300, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "city", width: 300, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "province", width: 125, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "zip_code", width: 100, allowSort: false, fixedWidth:true});
					grid.NewColumn({fname: "country", width: 150, fixedWidth:false, allowSort: true}); 
				});
			});
		}
	});	
};
