// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-service-status-codes.js
// uses edit-service-status-codes.js
//==================================================================================================
function ServiceStatusCodesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "service-status-codes",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "service-status-codes";
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				// grid.options.showCustomHeader = true;
				grid.options.autoScroll = true;
				grid.options.horzScroll = true;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				// grid.search.mode = "simple";
				// grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("service_type", {label:"Services"})	
				});	
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(251);
					ListServiceStatusCodes({
						statusCode: grid.dataset.get("code"),
						container: params.container
					})
				})

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "service_type", width: 480, allowSort: true, fixedWidth:true});
				});
			});
		}
	}));	
};

function ListServiceStatusCodes(params){
	var statusCode = params.statusCode;
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "service-status-details",
			theme: "child",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ServiceStatusCodesEdit({
				code: id,
				statusCode: params.statusCode,
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
						title: "Delete Service Status Code",
						message: ('Please confirm to delete service status code "<b>{0}</b>"').format(grid.dataset.get("sub_status"))
					}
				});
		
				grid.methods.add("deleteKeys", function(grid, id) {
					return [{
						code: id,
						status_code: grid.dataset.get("service_type")
					}];
				})
				
				grid.optionsData.url = "service-status-details";
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				grid.options.autoScroll = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("service_type", statusCode)
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						// .setprops("module", {label:"Service Type"})	
						.setprops("main_status", {label:"Main Status"})
						.setprops("sub_status_code", {label:"Sub-Status Code"})
						.setprops("sub_status", {label:"Sub-Status Description"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewColumn({fname: "module", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "main_status", width: 120, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "sub_status_code", width: 120, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "sub_status", width: 250, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_system"))
					row.attr("x-active", grid.dataset.get("is_active"))
				});
			})
		}
	}));
};
