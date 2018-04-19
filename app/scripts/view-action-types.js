function ActionTypesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "action-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			EditActionTypes({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Action Type",
						message: ('Please confirm to delete action type "<b>{0}</b>"').format(grid.dataset.get("action_type"))
					}
				});
				
				grid.optionsData.url = "action-types";				
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				// grid.options.showCustomHeader = true;
				grid.options.autoScroll = true;
				grid.options.horzScroll = true;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("action_type", {label:"Type"})
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(251);
					ListActionSubTypes({
						actionSubType: grid.dataset.get("code"),
						container: params.container
					})
				})
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "action_type", width: 500, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			})
		}
	}));
};

function ListActionSubTypes(params){
	var actionSubType = params.actionSubType;
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "action-types",
			theme: "child",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			EditActionSubTypes({
				code: id,
				actionSubType: params.actionSubType,
				container: container,
				showToolbar: false,
				dialog: dialog
			})
		},
		edit: function(id, e) {
			
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Action Sub-Type",
						message: ('Please confirm to delete action sub-type "<b>{0}</b>"').format(grid.dataset.get("action_name"))
					}
				});
		
				grid.methods.add("deleteKeys", function(grid, id) {
					return [{
						code: id,
						action_type: grid.dataset.get("action_type")
					}];
				})
				
				grid.optionsData.url = "action-sub-types";
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				grid.options.autoScroll = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("action_type", actionSubType)
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key: true})
						.setprops("action_name", {label:"Sub-Type"})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 100, fixedWidth:true});
					grid.NewColumn({fname: "action_name", width: "100%", fixedWidth:false});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			})
		}
	}));
};

