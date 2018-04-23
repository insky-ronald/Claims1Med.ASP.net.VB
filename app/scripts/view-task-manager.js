function TaskManagerView(params){
	// alerts(JSON.stringify(params));
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		options: {
			horzScroll: true
		},
		Painter: {
			css: defaultValue(params.pid, "tasks")
		},
		toolbarTheme:"svg",
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "task-manager";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = true;
				// grid.options.showBand = false;
				grid.options.showBand = true;
				grid.options.simpleSearch = false;
				// grid.options.simpleSearchField = "filter";
				grid.options.showAdvanceSearch = true;
				
				// grid.optionsData.editCallback = function(grid, id) {
					// __claim(id);
				// };
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "claim_no")
						.addColumn("order", "asc")
						// .addColumn("filter", "15-")
						.addColumn("filter", "")
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
						
						// .setprops("claim_status", {label:"Claim Status"})
						// .setprops("sub_status_code", {label:"Sub-Status"})
						// .setprops("sub_status", {label:"Description"})
						.setprops("service_status_code", {label:"Status"})
						.setprops("service_status", {label:"Status"})
						.setprops("service_sub_status_code", {label:"Sub-Status"})
						.setprops("service_sub_status", {label:"Sub-Status"})
						.setprops("provider_name", {label:"Provider"})
						// .setprops("doctor_name", {label:"Doctor"})
						.setprops("full_name", {label:"Claimant"})
						// .setprops("claim_currency_code", {label:"CCY"})
						// .setprops("settlement_currency_code", {label:"SCY"})
						.setprops("case_owner", {label:"Claim Owner"})
						.setprops("claim_type_name", {label:"Claim Type"})
						.setprops("service_type_name", {label:"Service Type"})
						.setprops("service_sub_type_name", {label:"Service Sub-Type"})
						.setprops("transaction_date", {label:"Admission Date", type:"date", required:true})
						.setprops("transaction_end_date", {label:"Discharge Date", type:"date", required:true})
						// .setprops("hcm_reference", {label:"HCM Reference"})
						// .setprops("actual_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
						// .setprops("paid_amount", {label:"Paid", numeric:true, type:"money", format:"00"})

						// .setprops("start_date", {label:"Admission Date", type:"date", required:true})
						// .setprops("end_date", {label:"Discharge Date", type:"date", required:true})

						// .setprops("invoice_no", {label:"Invoice No."})
						// .setprops("invoice_received_date", {label:"Date Received", type:"date", required:true})
						// .setprops("gender", {label:"Sex"})
						// .setprops("age", {label:"Age", numeric:true})
						.setprops("client_name", {label:"Client"})
						.setprops("product_name", {label:"Product"})
						// .setprops("plan_code", {label:"Plan Code"})
						// .setprops("plan_name", {label:"Plan Name"})
						.setprops("policy_no", {label:"Policy No.", required:true})
						// .setprops("certificate_no", {label:"Certificate No.", required:true})
						.setprops("policy_holder", {label:"Policy Holder", required:true})
						.setprops("diagnosis_code", {label:"ICD", required:true})
						.setprops("diagnosis", {label:"Diagnosis", required:true})
						
						// .setprops("update_date", {label:"Last Update", type:"date", format:"datetime"})
						// .setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
				});

				grid.Events.OnInitGridMenu.add(function(grid, menus) {
					var main;
					main = menus.add("Claim");
						main.add(grid.dataset.get("claim_no"), __claim(grid.dataset.get("claim_id"), true), "db-open");
						if(grid.dataset.get("service_no")) {
							main.add(grid.dataset.get("service_no"), __service(grid.dataset.get("service_id"), grid.dataset.get("service_type"), true), "db-open");
						}
						main.add(grid.dataset.get("patient_name"), __member(grid.dataset.get("member_id"), true), "db-open");
						
					main = menus.add("Policy");
						main.add(grid.dataset.get("policy_no"), __masterpolicy(grid.dataset.get("policy_id"), true), "db-open");
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"menu", float: "left"});
					
					var band;
					
					band = grid.NewBand("Action");
					band.NewColumn({fname: "action_class", width: 200, allowSort: true});
					band.NewColumn({fname: "action", width: 250, allowSort: true});
					band.NewColumn({fname: "action_owner", width: 125, allowSort: true});
					band.NewColumn({fname: "action_set_date", width: 100, allowSort: true});
					band.NewColumn({fname: "action_set_user", width: 100, allowSort: true});
					band.NewColumn({fname: "days", width: 100, allowSort: false});
					
					band = grid.NewBand("Claim and Service");
					band.NewColumn({fname: "claim_no", width: 100, allowSort: true});
					band.NewColumn({fname: "case_owner", width: 125, allowSort: true});
					band.NewColumn({fname: "claim_type_name", width: 100, allowSort: true});
					band.NewColumn({fname: "service_no", width: 175, allowSort: true});
					band.NewColumn({fname: "service_type_name", width: 150, allowSort: true});
					band.NewColumn({fname: "service_sub_type_name", width: 250, allowSort: true});

					band = grid.NewBand("Status");
					band.NewColumn({fname: "service_status", width: 100, allowSort: true});
					band.NewColumn({fname: "service_sub_status", width: 200, allowSort: true});
					
					
					// band = grid.NewBand("Claim");
					// band.NewColumn({fname: "claim_no", width: 100, allowSort: true});
					// band.NewColumn({fname: "case_owner", width: 125, allowSort: true});
					// band.NewColumn({fname: "claim_type_name", width: 100, allowSort: true});
					
					// band = grid.NewBand("Service");
					// band.NewColumn({fname: "service_no", width: 175, allowSort: true});
					// band.NewColumn({fname: "service_type_name", width: 150, allowSort: true});
					// band.NewColumn({fname: "service_sub_type_name", width: 250, allowSort: true});
					// band.NewColumn({fname: "full_name", width: 250, allowSort: true});
					
					band = grid.NewBand("Treatment");
					band.NewColumn({fname: "provider_name", width: 250, allowSort: true});
					band.NewColumn({fname: "transaction_date", width: 125, allowSort: true});
					band.NewColumn({fname: "transaction_end_date", width: 125, allowSort: true});
					band.NewColumn({fname: "diagnosis_code", width: 75, allowSort: true});
					band.NewColumn({fname: "diagnosis", width: 250, allowSort: true});

					band = grid.NewBand("Member");
					band.NewColumn({fname: "full_name", width: 250, allowSort: true});

					band = grid.NewBand("Client and Policy");
					band.NewColumn({fname: "client_name", width: 250, allowSort: true});
					band.NewColumn({fname: "product_name", width: 250, allowSort: true});
					band.NewColumn({fname: "policy_no", width: 100, allowSort: true});
					band.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		}
	});	
};
