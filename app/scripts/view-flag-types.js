// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-flag-types.js
// uses edit-flag-types.js
//==================================================================================================
function FlagTypesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "flag-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			FlagTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Flag Type",
					message: ('Please confirm to delete flag type "<b>{0}</b>"').format(grid.dataset.get("service_description"))
				}
			});
			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "flag-types";
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
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("service_description", {label:"Flag Type Description"})	
						.setprops("display_name", {label:"Display Name"})
				});	
				
				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(251);
					ListFlagSubTypes({
						flagSubType: grid.dataset.get("code"),
						container: params.container
					})
				})

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "service_description", width: 380, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "display_name", width: 300, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			});
		}
	});	
};

function ListFlagSubTypes(params){
	var flagSubType = params.flagSubType;
	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "flag-sub-types",
			theme: "child",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			EditFlagSubTypes({
				code: id,
				flagSubType: params.flagSubType,
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
						title: "Delete Flag Sub-Type",
						message: ('Please confirm to delete flag sub-type "<b>{0}</b>"').format(grid.dataset.get("flag_sub_type"))
					}
				});
		
				grid.methods.add("deleteKeys", function(grid, id) {
					return [{
						code: id,
						flag_code: grid.dataset.get("flag_code")
					}];
				})
				
				grid.optionsData.url = "flag-sub-types";
				grid.options.fixedColumnWidths = true;
				grid.options.allowSort = true;
				grid.options.autoScroll = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("flag_code", flagSubType)
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Flag Sub Code", numeric:false, key:true})
						.setprops("flag_sub_type", {label:"Flag Sub Type Description"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "flag_sub_type", width: 300, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("is_active"))
				});
			})
		}
	}));
};
