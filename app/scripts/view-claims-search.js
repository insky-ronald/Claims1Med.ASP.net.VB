function ClaimsSearchView(params){
	// alerts(JSON.stringify(params));
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		options: {
			horzScroll: true
		},
		Painter: {
			css: defaultValue(params.pid, "claims")
		},
		toolbarTheme:"svg",
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "claims-search";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = false;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				// grid.optionsData.editCallback = function(grid, id) {
					// __claim(id);
				// };
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "claim_no")
						.addColumn("order", "asc")
						.addColumn("filter", "15-")
						// .addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("claim_no", {label:"Claim No."})
						.setprops("service_no", {label:"Service No."})
						.setprops("claim_status", {label:"Claim Status"})
						.setprops("sub_status_code", {label:"Sub-Status"})
						.setprops("sub_status", {label:"Description"})
						.setprops("status", {label:"Status"})
						.setprops("provider_name", {label:"Hospital"})
						.setprops("doctor_name", {label:"Doctor"})
						.setprops("patient_name", {label:"Claimant"})
						.setprops("claim_currency_code", {label:"CCY"})
						.setprops("settlement_currency_code", {label:"SCY"})
						.setprops("claim_type", {label:"Claim Type"})
						.setprops("service_name", {label:"Service Type"})
						.setprops("hcm_reference", {label:"HCM Reference"})
						.setprops("actual_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
						.setprops("paid_amount", {label:"Paid", numeric:true, type:"money", format:"00"})

						.setprops("start_date", {label:"Admission Date", type:"date", required:true})
						.setprops("end_date", {label:"Discharge Date", type:"date", required:true})

						.setprops("invoice_no", {label:"Invoice No."})
						// .setprops("invoice_received_date", {label:"Invoice Received Date", type:"date", required:true})
						.setprops("invoice_received_date", {label:"Date Received", type:"date", required:true})
						// .setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
						.setprops("gender", {label:"Sex"})
						.setprops("age", {label:"Age", numeric:true})
						// .setprops("expired", {label:"Expired"})
						.setprops("client_name", {label:"Client"})
						.setprops("plan_code", {label:"Plan Code"})
						.setprops("plan_name", {label:"Plan Name"})
						.setprops("policy_no", {label:"Policy No.", required:true})
						.setprops("certificate_no", {label:"Certificate No.", required:true})
						.setprops("policy_holder", {label:"Policy Holder", required:true})
						.setprops("diagnosis_code", {label:"ICD", required:true})
						.setprops("diagnosis", {label:"Diagnosis", required:true})
						
						.setprops("update_date", {label:"Last Update", type:"date", format:"datetime"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
				});

				grid.Events.OnInitGridMenu.add(function(grid, menus) {
					var main;
					main = menus.add("Claim");
						main.add(grid.dataset.get("claim_no"), __claim(grid.dataset.get("claim_id"), true), "db-open");
						if(grid.dataset.get("service_no"))
							main.add(grid.dataset.get("service_no"), __service(grid.dataset.get("service_id"), grid.dataset.get("service_type"), true), "db-open");
						main.add(grid.dataset.get("patient_name"), __member(grid.dataset.get("member_id"), true), "db-open");
						
					main = menus.add("Policy");
						main.add(grid.dataset.get("policy_no"), __masterpolicy(grid.dataset.get("policy_id"), true), "db-open");
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewCommand({command:"open", float: "left"});
					grid.NewCommand({command:"menu", float: "left"});
					grid.NewColumn({fname: "claim_no", width: 100, allowSort: true});
					grid.NewColumn({fname: "service_no", width: 175, allowSort: true});
					// grid.NewColumn({fname: "claim_no", width: 100, allowSort: true, drawContent:function(c) {
						// c.html(("<a href='/app/claim/{0}' target='_blank' x-sec='link'>{1}</a>").format(grid.dataset.get("claim_id"), grid.dataset.get("claim_no")));
					// }});
					// grid.NewColumn({fname: "service_no", width: 175, allowSort: true, drawContent:function(c) {
					// }});
					grid.NewColumn({fname: "status", width: 125, allowSort: true});
					grid.NewColumn({fname: "provider_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "doctor_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "claim_currency_code", width: 50, allowSort: true});
					grid.NewColumn({fname: "actual_amount", width: 100, allowSort: true});
					grid.NewColumn({fname: "settlement_currency_code", width: 50, allowSort: true});
					grid.NewColumn({fname: "paid_amount", width: 100, allowSort: true});
					grid.NewColumn({fname: "patient_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "claim_type", width: 100, allowSort: true});
					grid.NewColumn({fname: "service_name", width: 200, allowSort: true});
					grid.NewColumn({fname: "claim_status", width: 100, allowSort: true});
					grid.NewColumn({fname: "hcm_reference", width: 150, allowSort: true});
					grid.NewColumn({fname: "invoice_no", width: 150, allowSort: true});
					grid.NewColumn({fname: "invoice_received_date", width: 150, allowSort: true});
					grid.NewColumn({fname: "sub_status_code", width: 100, allowSort: true});
					grid.NewColumn({fname: "sub_status", width: 200, allowSort: true});
					grid.NewColumn({fname: "gender", width: 75, allowSort: false});
					grid.NewColumn({fname: "age", width: 75, allowSort: false});
					grid.NewColumn({fname: "start_date", width: 125, allowSort: false});
					grid.NewColumn({fname: "end_date", width: 125, allowSort: false});
					grid.NewColumn({fname: "client_name", width: 250, allowSort: true});
					grid.NewColumn({fname: "plan_code", width: 100, allowSort: true});
					grid.NewColumn({fname: "plan_name", width: 200, allowSort: true});
					grid.NewColumn({fname: "policy_no", width: 150, allowSort: true});
					grid.NewColumn({fname: "certificate_no", width: 150, allowSort: true});
					grid.NewColumn({fname: "policy_holder", width: 250, allowSort: true});
					grid.NewColumn({fname: "diagnosis_code", width: 100, allowSort: true});
					grid.NewColumn({fname: "diagnosis", width: 250, allowSort: true});
					grid.NewColumn({fname: "create_date", width: 150, allowSort: true});
					grid.NewColumn({fname: "update_date", width: 150, allowSort: true});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		}
	});	
};
