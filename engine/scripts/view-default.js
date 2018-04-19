function DefaultView(params, settings){
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		Painter: {
			css: settings.viewID
		},
		toolbarTheme: defaultValue(settings.toolbarTheme, "svg"),
		editForm: function(id, container, dialog) {
			// PopupEditor() refer to edit-default.js
			PopupEditor({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
			}, {
				postBack: settings.viewID,
				init: settings.initEdit
			});
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				grid.dataset.gotoKey(id);
				return {title: "Delete " + settings.tableName, message: ("Please confirm to delete {0} <b>{1}</b>.").format(settings.tableName, grid.dataset.get(settings.deletePromptName))};
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				// grid.optionsData.url = settings.viewID;
				if(settings.requestPath)
					grid.optionsData.url = settings.requestPath +"/"+ settings.viewID
				else
					grid.optionsData.url = settings.viewID;
				
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.showHeader = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = false;
				
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
			});
			
			grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
				dataParams
					.addColumn("filter", "")
					.addColumn("page", 1, {numeric:true})
					.addColumn("pagesize", 25, {numeric:true})
					.addColumn("sort", settings.defaultSort)
					.addColumn("order", "asc")
			});
			
			settings.init(grid);
		}
	});	
};
