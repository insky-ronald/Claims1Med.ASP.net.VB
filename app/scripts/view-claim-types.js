// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-claim-types.js
// uses edit-claim-types.js
//==================================================================================================
function ClaimTypesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "claim-types",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			ClaimTypesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/claim-types?"+ ObjectToRequestParams(params.requestParams);
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.exportData.allow = true;
				grid.exportData.name = "Claim Types";
				grid.exportData.source = "DBMedics.GetClaimTypes";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {
						title: "Delete Claim Type",
						message: ('Please confirm to delete claim type "<b>{0}</b>"').format(grid.dataset.get("claim_type"))
					}
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("claim_type", {label:"Claim Type Description"})						
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "claim_type", width: 250, allowSort: true, fixedWidth:true});
				});
			});
		}
	});	
};
