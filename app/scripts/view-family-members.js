function FamilyMembersView(params){
	// console.log(params)
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		options: {
			horzScroll: true
		},
		Painter: {
			css: "members"
		},
		toolbarTheme:"svg",
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "members-search";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = false;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = false;
				grid.options.simpleSearchField = "filter";
				
				grid.optionsData.editCallback = function(grid, id) {
					__member(id);
				};
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "full_name")
						.addColumn("order", "asc")
						.addColumn("certificate_id", params.certificate_id)
						// .addColumn("certificate_id", 391751)
						.addColumn("filter", "member")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("relationship_code", {label:"Relationship"})
						.setprops("full_name", {label:"Name"})
						.setprops("sex", {label:"Sex", getText:function(column, value) {
							return value == "F" ? "Female" : (value == "M" ? "Male" : "");
						})
						.setprops("client_name", {label:"Client"})
						.setprops("dob", {label:"DOB", type:"date"})
				});

				grid.Events.OnInitGridMenu.add(function(grid, menus) {
					var main;
					main = menus.add("Member");					
						main.add(grid.dataset.get("full_name"), __member(grid.dataset.get("member_id"), true), "user");
					main = menus.add("Client");					
						main.add(grid.dataset.get("client_name"), __client(grid.dataset.get("client_id"), true), "db-open");
						main.add("Policy: " + grid.dataset.get("policy_no"), __masterpolicy(grid.dataset.get("policy_id"), true), "db-open");
						main.add("Product: " + grid.dataset.get("product_name"), __product(grid.dataset.get("product_id"), true), "db-open");
						main.add("Plan: " + grid.dataset.get("plan_name"), __product(grid.dataset.get("plan_id"), true), "db-open");
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"open", float: "left"});
					grid.NewColumn({fname: "full_name", width: 200, allowSort: true});
					grid.NewColumn({fname: "relationship_code", width: 100, allowSort: false});
					grid.NewColumn({fname: "sex", width: 50, allowSort: false});
					grid.NewColumn({fname: "dob", width: 100, allowSort: false});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		}
	});	
};
