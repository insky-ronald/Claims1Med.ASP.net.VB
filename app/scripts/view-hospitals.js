// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-hospitals.js
//==================================================================================================
function HospitalsView(params){	
	// var providerType = params.providerType;

	return new jGrid($.extend(params, {
		paintParams: {
			css: "hospitals",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			HospitalEdit({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/hospitals"; //+ ObjectToRequestParams(params.requestParams);
				
				// grid.options.editNewPage = true;
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				// grid.search.mode = "advanced";
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {					
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						// .addColumn("provider_type", providerType)
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("code", {label:"SunCode"})
						.setprops("spin_id", {label:"SPIN ID"})
						.setprops("name", {label:"Name"})
						.setprops("country", {label:"Country"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code"))
				});	
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					grid.dataset.gotoKey(id);
					return {title: "Delete Hospital", message: ("Please confirm to delete hospital <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				// grid.methods.add("getCommandIcon", function(grid, column) {
					// if(column.command === "open") {
						// return "db-open"
					// } else {
						// return ""
					// }
				// })
				
				// grid.methods.add("editPageUrl", function(grid, id) {
					// return __doctor(id, true)
				// })
				
				grid.events.OnInitSearch.add(function(grid, editor) {
					editor.Events.OnInitData.add(function(sender, data) {
						data.Columns
							.setprops("filter", {label:"Policy Number"})
							.setprops("policy_number", {label:"Policy Number"})
							// .setprops("start_date", {label:"Start", type:"date"})
							// .setprops("end_date", {label:"End", type:"date"})
							// .setprops("debit_account_codes", {label:"Debit Accounts"})
					});
					
					editor.Events.OnInitEditor.add(function(sender, editor) {
						editor.NewGroupEdit("General", function(editor, tab) {
							// editor.AddText("policy_number");
							editor.AddText("filter");
						});
						
						editor.NewSubSelectionView("Debit Accounts", 300, "broker_ids", AccountsLookupView);
						// editor.NewSubSelectionView("Debit Accounts", 300, "debit_account_codes", AccountsLookupView);
						// editor.NewSubSelectionView("Credit Accounts", 300, "credit_account_codes", AccountsLookupView);
					});
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({id:"00", caption: "General"}, function(band) {
						band.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "code", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "spin_id", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "name", width: 200, aloowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "full_name", width: 250, aloowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "specialisation", width: 200, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "discount", width: 80, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "country", width: 200, allowSort: false, fixedWidth:true});
					})
				});
				
			});
		}
	}));
};
