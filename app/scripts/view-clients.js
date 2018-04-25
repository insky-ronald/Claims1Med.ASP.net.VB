// ****************************************************************************************************
// Last modified on
//
// ****************************************************************************************************
//==================================================================================================
// File name: view-clients.js
//==================================================================================================
function ClientsGrid(params){
	// var providerType = params.providerType;

	return new jGrid($.extend(params, {
		paintParams: {
			css: "clients",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			DoctorEdit2({
				id: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/clients"; //+ ObjectToRequestParams(params.requestParams);

				grid.options.editNewPage = true;
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
						.setprops("account_code", {label:"SunCode"})
						.setprops("soa_prefix", {label:"SOA Prefix"})
						.setprops("name", {label:"Name"})
						// .setprops("full_name", {label:"Full Name"})
						// .setprops("specialisation", {label:"Specialisation"})
						.setprops("client_currency_code", {label:"Currency"})
						// .setprops("discount_amount", {label:"Amount", numeric:true})
						// .setprops("discount_percent", {label:"Percantage", numeric:true})
						// .setprops("notes", {label:"Notes"})
						// .setprops("discount_type_id", {label:"Discount",
							// getText: function(column, value) {
								// if(value === "1") {
									// return ("{0}% on invoice total").format(column.dataset.get("discount_percent"))
								// } else if(value === "3") {
									// return ("{0}% per invoice item").format(column.dataset.get("discount_percent")) 
								// } else if(value === "4") {
									// return ("IDR {0} per invoice item").format(column.dataset.get("discount_amount"))
								// } else {
									// return "..."
								// }
							// }
						// })
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					row.attr("x-status", grid.dataset.get("status_code"));
					// row.attr("x-blacklisted", grid.dataset.get("blacklisted"));
				});

				grid.methods.add("deleteConfirm", function(grid, id) {
					grid.dataset.gotoKey(id);
					return {title: "Delete Client", message: ("Please confirm to delete client <b>{0}</b>.").format(grid.dataset.get("name"))};
				});
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __client(id, true)
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
					grid.NewBand({caption: "General"}, function(band) {
						band.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "account_code", width: 100, allowSort: false, fixedWidth:true});
						band.NewColumn({fname: "client_currency_code", width: 100, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "name", width: 300, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "soa_prefix", width: 100, allowSort: false, fixedWidth:true});
						// band.NewColumn({fname: "specialisation", width: 200, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "discount", width: 80, allowSort: false, fixedWidth:true});
						// band.NewColumn({fname: "country", width: 200, allowSort: false, fixedWidth:true});
						// band.NewColumn({fname: "discount_type_id", width: 200, allowSort: false, fixedWidth:true});
					})
				})
			})
		}
	}))
};
