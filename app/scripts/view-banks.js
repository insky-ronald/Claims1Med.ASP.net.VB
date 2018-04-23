// ****************************************************************************************************
// File name: view-master-policies.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-banks.js
//==================================================================================================
function BanksView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "banks",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			BanksEdit({
				url: ("?id={0}&name_id={1}").format(id, params.getMasterID()),
				container: container,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "banks";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showPager = false;
				grid.search.visible = false;
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("name_id", params.getMasterID(), {numeric:true})
						.addColumn("sort", "bank_name")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("bank_name", {label:"Bank Name"})
						.setprops("sort_code", {label:"Sort Code"})
						.setprops("swift_code", {label:"Swift Code"})
						.setprops("bank_address1", {label:"Bank Address 1"})
						.setprops("bank_address2", {label:"Bank Address 2"})
						.setprops("bank_address3", {label:"Bank Address 3"})
						.setprops("bank_country", {label:"Bank Country"})
						.setprops("beneficiary_name", {label:"Beneficiary Name"})
						.setprops("beneficiary_bank_account", {label:"Beneficiary Bank Account"})
						.setprops("beneficiary_address1", {label:"Beneficiary Address 1"})
						.setprops("beneficiary_address2", {label:"Beneficiary Address 2"})
						.setprops("beneficiary_address3", {label:"Beneficiary Address 3"})
						.setprops("beneficiary_country", {label:"Beneficiary Country"})
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "bank_name", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "sort_code", width: 100, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "swift_code", width: 100, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "bank_address1", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "bank_address2", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "bank_address3", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "bank_country", width: 150, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_name", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_bank_account", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_address1", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_address2", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_address3", width: 200, allowSort: true, fixedWidth: true});
					grid.NewColumn({fname: "beneficiary_country", width: 200, allowSort: true, fixedWidth: false});
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Bank",
						message: ('Please confirm to delete bank.')
					}
				});
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				// });
			});
		}
	}));	
};
