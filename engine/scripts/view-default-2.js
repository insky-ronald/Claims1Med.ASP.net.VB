function DefaultView(params, settings) {
	var requestParams = params.requestParams;
	// console.log(requestParams)
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: settings.css
		},
		editForm: function(id, container, dialog) {
			if(settings.initEdit) {
				var params = {
					id: id,
					container: container,
					containerPadding: 0,				
					showToolbar: false,
					pageControlTheme: "data-entry",
					fillContainer: true,
					dialog: dialog
				};
				
				settings.initEdit(params);
				
				if(settings.editProc) 
					settings.editProc(params)
			};
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return settings.deleteConfirm(grid, id);
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = settings.url;
				// if(params.requestParams)
					// grid.optionsData.url += "?"+ ObjectToRequestParams(params.requestParams);
				// grid.optionsData.url = name +"?"+ ObjectToRequestParams(params.requestParams);
				// grid.optionsData.masterDetail = params.masterDetail;
				grid.optionsData.masterDataset = params.masterDataset;
				// params.masterDataset.addMasterDetail(grid.optionsData.masterDataset)
				// console.log(params.masterDataset)
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				
				if(settings.initGrid)
					settings.initGrid(grid);
				
				grid.Events.OnInitRequestParams.add(function(grid, requestParams) {
					// console.log(requestParams)
					if(settings.initRequestParams)
						settings.initRequestParams(grid, requestParams);
				});
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "")
						.addColumn("order", "")
						.addColumn("filter", "");
						
					if(settings.initSearch)
						settings.initSearch(grid, dataParams);
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					if(settings.initData)
						settings.initData(grid, data);
					
					if(grid.optionsData.masterDataset)
						if(settings.onMaterDatasetUpdate)
							grid.Events.OnInitRequestParams.add(function(grid, requestParams) {
								settings.onMaterDatasetUpdate(grid, requestParams);
							});
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					if(settings.initRow)
						settings.initRow(grid, row);
				});	
	
				grid.Methods.add("getCommandIcon", function(grid, column) {
					if(settings.getCommandIcon)
						return settings.getCommandIcon(grid, column)
					else
						return "";
				});
	
				grid.Methods.add("getCommandHint", function(grid, column) {
					if(settings.getCommandHint)
						return settings.getCommandHint(grid, column)
					else
						return "";
				});
				
				grid.Events.OnCommand.add(function(grid, params) {
					if(settings.onCommand)
						settings.onCommand(grid, params);
				});

				grid.Events.OnInitColumns.add(function(grid) {
					if(settings.initColumns)
						settings.initColumns(grid);
				});
			});
		}
	});	
};
