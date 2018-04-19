// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-users.js
// uses edit-account.js
//==================================================================================================
// var BudgetsView = BudgetsView_Test2
// var BudgetsView = BudgetsView_Test
var BudgetsView = BudgetsView_Current //http://medics5.insky-inc.com/engine/get/list/sys-users?

function BudgetsView_Test2(params){
	
	var name = "task-manager";
	var requestParams = params.requestParams;
	var year = requestParams.year ? requestParams.year : 2017;
	
	// add new properties to params
	// params = Object.assign(params, {
	$.extend(params, {
		options: {
			horzScroll: true
		},
		paintParams: {
			css: "sys-users",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Budget",
					message: ('Please confirm to delete budget "<b>{0}</b>"').format(grid.dataset.lookup(id, "code"))
				}
			});
			
			// grid.Events.OnInitGrid.add(function(grid) *** OnInitGrid: depricated
			grid.Events.OnInit.add(function(grid) {
				// grid.debug("grid.Events.OnInit")
				grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
				
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				// grid.options.showSummary = true;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = true;
				// grid.options.showSelection = false;
				grid.options.showMenuButton = true;
				// grid.options.showBand = false;
				grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "claim_no")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						// .addColumn("filter", "15-")
						// .addColumn("filter", "14-")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("claim_no", {label:"Claim No."})
						.setprops("service_no", {label:"Service No."})
						.setprops("action_class", {label:"Action Class"})
						.setprops("action", {label:"Action"})
						.setprops("action_owner", {label:"Owner"})
						.setprops("action_set_date", {label:"Creation Date", type:"date", required:true})
						.setprops("action_set_user", {label:"Action Creator"})
						.setprops("days", {label:"Days Overdue", numeric:true})
						.setprops("service_status_code", {label:"Status"})
						.setprops("service_status", {label:"Status"})
						.setprops("service_sub_status_code", {label:"Sub-Status"})
						.setprops("service_sub_status", {label:"Sub-Status"})
						.setprops("provider_name", {label:"Provider"})
						.setprops("full_name", {label:"Claimant"})
						.setprops("case_owner", {label:"Claim Owner"})
						.setprops("claim_type_name", {label:"Claim Type"})
						.setprops("service_type_name", {label:"Service Type"})
						.setprops("service_sub_type_name", {label:"Service Sub-Type"})
						.setprops("transaction_date", {label:"Admission Date", type:"date", required:true})
						.setprops("transaction_end_date", {label:"Discharge Date", type:"date", required:true})
						.setprops("client_name", {label:"Client"})
						.setprops("product_name", {label:"Product"})
						.setprops("policy_no", {label:"Policy No.", required:true})
						.setprops("policy_holder", {label:"Policy Holder", required:true})
						.setprops("diagnosis_code", {label:"ICD", required:true})
						.setprops("diagnosis", {label:"Diagnosis", required:true})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
				});	

				grid.Events.OnInitToolbar.add(function(grid, toolbar) {	
					// toolbar.NewItem({
						// id: "test",
						// icon: "new",
						// iconColor: "#8DCF6E",
						// hint: "Test",
						// click: function(item) {
							// desktop.Ajax(this, ("/{0}/get/{1}/{2}").format("app", "test", "countries"), {id: grid.dataset.getKey()}, function(data) {	
								// console.log(data)
							// })
						// }
					// });
				});	
		
				grid.methods.add("allowCommand", function(grid, column) {
					return grid.dataset.get("id") > 1850
				})
		
				grid.methods.add("getCommandHint", function(grid, column) {
					return "Manage Permissions"
				})
				
				grid.methods.add("getCommandIcon", function(grid, column) {
					return "security"
				})
				
				grid.events.OnCommand.add(function(grid, params) {
					if(params.command == "permission") {
						// console.log(params)
						// console.log(grid.dataset.get("id"))
					}
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					console.log(grid.selections.length)
					// grid.options.showSummary = true;
					grid.options.showSummary = false;
					grid.options.showBand = true;
					// grid.options.showBand = false;
					grid.options.showSelection = true;
					// grid.options.showSelection = false;
					
					grid.NewBand({id:"00", caption: "", fixed:"left"}, function(band) {
						band.NewCommand({command:"permission"});
						// band.NewColumn({fname: "id", width: 50, allowSort: true});
						// band.NewColumn({fname: "claim_no", width: 100, allowSort: true});
					})
					
					// grid.NewBand({id:"01", caption: "01", fixed:"middle"}, function(band) {
						// band.NewBand({id:"011", caption: "011", fixed:"middle"}, function(band) {
							// band.NewColumn({fname: "action_set_date", width: 150, allowSort: true});
							// band.NewColumn({fname: "action_set_user", width: 150, allowSort: true});
							// band.NewColumn({fname: "days", width: 100, allowSort: false});
						// })
						
						// band.NewBand({id:"012", caption: "012", fixed:"middle"}, function(band) {
							// band.NewBand({id:"0121", caption: "0121", fixed:"middle"}, function(band) {
								// band.NewColumn({fname: "action_set_date", width: 150, allowSort: true});
								// band.NewColumn({fname: "action_set_user", width: 150, allowSort: true});
								// band.NewColumn({fname: "days", width: 100, allowSort: false});
							// })							
							// band.NewBand({id:"0122", caption: "0122", fixed:"middle"}, function(band) {
								// band.NewColumn({fname: "action_set_date", width: 150, allowSort: true});
								// band.NewColumn({fname: "action_set_user", width: 150, allowSort: true});
								// band.NewColumn({fname: "days", width: 100, allowSort: false});
							// })							
						// })
					// });
					
					grid.NewBand({id:"02", caption: "Claim and Service", fixed:"middle"}, function(band) {
						// band.NewBand({id:"02A", caption: "02A", fixed:"middle"}, function(band) {
							band.NewColumn({fname: "id", width: 50, allowSort: true});
							band.NewColumn({fname: "claim_no", width: 100, allowSort: true});
							band.NewColumn({fname: "case_owner", width: 125, allowSort: true});
							band.NewColumn({fname: "claim_type_name", width: 100, allowSort: true});
						// })
						// band.NewBand({id:"02B", caption: "02B", fixed:"middle"}, function(band) {
							band.NewColumn({fname: "service_no", width: 175, allowSort: true});
							band.NewColumn({fname: "service_type_name", width: 150, allowSort: true});
							band.NewColumn({fname: "service_sub_type_name", width: 250, allowSort: true});
						// })
					});

					grid.NewBand({id:"03", caption: "Status", fixed:"middle"}, function(band) {
						band.NewColumn({fname: "service_status", width: 100, allowSort: true});
						band.NewColumn({fname: "service_sub_status", width: 200, allowSort: true});
					});
					
					grid.NewBand({id:"04", caption: "Treatment", fixed:"middle"}, function(band) {
						band.NewColumn({fname: "provider_name", width: 250, allowSort: true});
						band.NewColumn({fname: "transaction_date", width: 125, allowSort: true});
						band.NewColumn({fname: "transaction_end_date", width: 125, allowSort: true});
						band.NewColumn({fname: "diagnosis_code", width: 75, allowSort: true});
						band.NewColumn({fname: "diagnosis", width: 200, allowSort: true});
					});

					// grid.NewBand({id:"05", caption: "Member", fixed:"middle"}, function(band) {
						// band.NewColumn({fname: "full_name", width: 250, allowSort: true});
					// });

					// grid.NewBand({id:"06", caption: "Client and Policy", fixed:"middle"}, function(band) {
						// band.NewColumn({fname: "client_name", width: 250, allowSort: true});
						// band.NewColumn({fname: "product_name", width: 250, allowSort: true});
						// band.NewColumn({fname: "policy_no", width: 100, allowSort: true});
						// band.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
					// });

					// grid.NewBand({id:"07", caption: "...", fixed:"right"}, function(band) {
						// band.NewColumn({fname: "id", width: 50, allowSort: true});
						// band.NewColumn({fname: "claim_no", width: 100, allowSort: true});
					// });
				});
				
			});
			
			if(callback)
				callback(grid)
		}
	});
	
	// console.log(params)
	return new jGrid(params);
};

function BudgetsView_Test(params){
	
	var name = "engine/sys-users";
	var requestParams = params.requestParams;
	var year = requestParams.year ? requestParams.year : 2017;
	
	// add new properties to params
	// params = Object.assign(params, {
	$.extend(params, {
		options: {
			horzScroll: true
		},
		paintParams: {
			css: "sys-users",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			BudgetEdit({
				url: ("?id={0}&owner_id={1}").format(id, requestParams.owner_id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog,
				customData: {
					owner_id: requestParams.owner_id
				}
			})
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Budget",
					message: ('Please confirm to delete budget "<b>{0}</b>"').format(grid.dataset.lookup(id, "code"))
				}
			});
			
			// grid.Events.OnInitGrid.add(function(grid) *** OnInitGrid: depricated
			grid.Events.OnInit.add(function(grid) {
				// grid.debug("grid.Events.OnInit")
				grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
				
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				// grid.options.showSummary = false;
				grid.options.showSummary = true;
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
						.addColumn("sort", "user_name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("user_name", {label:"User ID"})
						.setprops("full_name", {label:"This is the person's full name"})
						.setprops("role_names", {label:"Roles"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					var band = grid.newBand({id: "test", caption: "Test", fixed: "left"})
					band.NewColumn({fname: "id", width: 75, allowSort: true})
					band.NewColumn({fname: "user_name", width: 150, allowSort: true, allowFilter: true})
					
					// grid.NewColumn({fname: "user_name", width: 150, allowSort: true, fixedWidth:true})
					// grid.NewColumn({fname: "full_name", width: 300, allowSort: true, fixedWidth:true})
					
					// var band2 = grid.newBand({id: "test", caption: "Test", fixed: "right"})
					// band2.NewColumn({fname: "role_names", width: 300, allowSort: false, fixedWidth:false})
					
					
					// grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true})
					// grid.NewColumn({fname: "user_name", width: 150, allowSort: true, allowFilter: true, fixedWidth:true})
					grid.NewColumn({fname: "full_name", width: 300, allowSort: true, fixedWidth:true})
					grid.NewColumn({fname: "role_names", width: 300, allowSort: true, fixedWidth:false})
					
					grid.NewColumn({fname: "id", width: 75, allowSort: false, fixedWidth:true})
					grid.NewColumn({fname: "user_name", width: 150, allowSort: false, fixedWidth:true})
					grid.NewColumn({fname: "full_name", width: 300, allowSort: false, fixedWidth:true})
					grid.NewColumn({fname: "role_names", width: 300, allowSort: false, fixedWidth:false})
					
					// grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true})
					// grid.NewColumn({fname: "user_name", width: 150, allowSort: true, fixedWidth:true})
					// grid.NewColumn({fname: "full_name", width: 300, allowSort: true, fixedWidth:true})
					// grid.NewColumn({fname: "role_names", width: 300, allowSort: true, fixedWidth:false})
				});
			});
			
			if(callback)
				callback(grid)
		}
	});
	
	// console.log(params)
	return new jGrid(params);
};

function BudgetsView_Current(params){
	var name = "engine/sys-users";
	var requestParams = params.requestParams;
	var year = requestParams.year ? requestParams.year : 2017;
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-users"
		},
		editForm: function(id, container, dialog) {
			BudgetEdit({
				url: ("?id={0}&owner_id={1}").format(id, requestParams.owner_id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog,
				customData: {
					owner_id: requestParams.owner_id
				}
			})
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Budget",
					message: ('Please confirm to delete budget "<b>{0}</b>"').format(grid.dataset.lookup(id, "code"))
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
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
						.addColumn("sort", "user_name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						// .addColumn("year", 2016, {numeric:true})
						// .addColumn("year", year, {numeric:true})
						// .addColumn("owner_id", requestParams.owner_id, {numeric:true})
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("user_name", {label:"User ID"})
						.setprops("full_name", {label:"Full Name"})
						.setprops("role_names", {label:"Roles"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "user_name", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "full_name", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "role_names", width: 300, allowSort: false, fixedWidth:false});
					// grid.NewColumn({fname: "code", width: 125, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "description", width: 250, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "amount", width: 150, fixedWidth:true, allowSort: false});
					// grid.NewColumn({fname: "year", width: 100, fixedWidth:true, allowSort: false});
					// grid.NewColumn({fname: "frequency2", width: 0, allowSort: false});
				});
			});
		}
	});	
};
