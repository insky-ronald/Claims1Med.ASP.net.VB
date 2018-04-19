function PaymentBatchesView(params){
	return new JDBGrid({
		owner: params.owner,
		container: params.container, 
		options: {
			horzScroll: true
		},
		Painter: {
			css: "payment-batches"
		},
		toolbarTheme:"svg",
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "clients";
				grid.options.showToolbar = true;
				grid.options.horzScroll = true;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = false;
				grid.options.showBand = false;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				grid.optionsData.editCallback = function(grid, id) {
					__batch(id);
				};

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
				
				grid.Methods.add("canAdd", function(grid) {
					return defaultValue(params.canAdd, false);
				});
				
				grid.Methods.add("canEdit", function(grid) {
					return defaultValue(params.canEdit, false);
				});
				
				grid.Methods.add("canDelete", function(grid) {
					return defaultValue(params.canDelete, false);
				});
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					// grid.owner.InitializeQuery(dataParams);
					dataParams
						.addColumn("name", "")
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "pin")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					// grid.owner.InitializeTableData(data);
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("pin", {label:"PIN"})
						.setprops("name", {label:"Name"})
						.setprops("currency_code", {label:"Currency"})
						.setprops("country", {label:"Country"})
				});
					
				grid.Events.OnInitEditData.add(function(grid, data) {
					// grid.owner.InitializeEditData(data);
				});
				
				grid.Events.OnInitEditor.add(function(grid, editor) {
					// grid.owner.InitializeEditor(editor);
				});

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.owner.InitializeColumns(grid);
					grid.NewCommand({command:"open", float: "left"});
					grid.InitBands("Client", function(band) {
						band.InitBands("PIN and Name", function(band) {
							band.InitBands("1", function(band) {
								band.NewColumn({fname: "pin", width: 100, allowSort: true});
							});
							
							band.InitBands("2", function(band) {
								band.NewColumn({fname: "name", width: 300, allowSort: true});
							});
						})
						band.InitBands("Currency and Country", function(band) {
							band.NewColumn({fname: "currency_code", width: 100});
							band.NewColumn({fname: "country", width: 200});
						});
					});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					// toolbar.grid = grid;
					// grid.owner.InitializeToolbar(toolbar);
				});
			});
		}
	});	
};
