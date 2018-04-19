function GroupsView(params){
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		options: {
			horzScroll: true
		},
		Painter: {
			css: "user-groups"
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = "user-groups";
				grid.optionsData.url = "groups";
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.showHeader = false;
				grid.options.cardView = false;
				grid.options.autoScroll = false;
				grid.options.allowSort = true;
				grid.options.showSelection = true;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("filter", "")
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "group_name")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:false, key: true})
						.setprops("group_name", {label:"Group"})
						
					data.Events.OnUpdateUserGroups = new EventHandler(this);
					data.Events.OnUpdateUserGroups.add(function(dataset, userName) {
						desktop.Ajax(this, ("/get/{0}/{1}").format("user-groups", "users"), {user_name: userName}, function(result) {
							grid.selections = result.groups.split(",");
							grid.Repaint();
						});
					});
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "group_name", width: 300});
					// grid.NewColumn({fname: "id", width: 75});
				});
				
				grid.Events.AfterPaintContent.add(function(grid) {
					grid.dataset.Events.OnUpdateUserGroups.trigger(params.user_name);
				});
			});
		}
	});	
};
