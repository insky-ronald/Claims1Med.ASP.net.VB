// ****************************************************************************************************
// File name: view-master-policies.js
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// uses edit-address.js
//==================================================================================================
function BanksView(params){
	//console.log(params)
	var name_id = params.requestParams.name_id;;
	
	return new JDBGrid({
		params: params,
		// container: params.container, 
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "banks"
		},
		editForm: function(id, container, dialog) {
			BanksEdit({
				url: ("?id={0}&name_id={1}").format(id, name_id),
				container: container,
				containerPadding: 0,
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "banks";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				// grid.optionsData.editCallback = function(grid, id) {
					// __masterpolicy(id);
				// };

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("name_id", name_id, {numeric:true})
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
	});	
};
