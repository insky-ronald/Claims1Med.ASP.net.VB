// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-limits.js
//==================================================================================================
function LimitsView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "limits",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			LimitEdit({
				id: id,
				service_id: params.requestParams.service_id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/limits";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				// grid.search.mode = "simple";
				// grid.search.columnName = "name";
				
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("schedule_id", params.requestParams.service_id, {numeric:true})
						.addColumn("sort", "rule_code")
						.addColumn("order", "asc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("rule_code", {label:"Code", required:true})
						.setprops("rule_name", {label:"Rule"})
						.setprops("currency_code", {label:"Crcy"})
						.setprops("max_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
						.setprops("max_units", {label:"Units", numeric:true, type:"money", format:"0"})
						.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
						.setprops("max_percent", {label:"Percent", numeric:true, type:"money", format:"00"})
						.setprops("unit_specification", {label:"Unit Spec"})
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Limit", message: ("Please confirm to delete limit <b>{0}</b>.").format(grid.dataset.get("rule_name"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "rule_name", width: 200, fixedWidth:false});
					grid.NewColumn({fname: "currency_code", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "max_amount", width: 100, fixedWidth:false});
					grid.NewColumn({fname: "deductible", width: 100, fixedWidth:false});
					grid.NewColumn({fname: "max_units", width: 75, fixedWidth:false});
					grid.NewColumn({fname: "unit_specification", width: 100, fixedWidth:false});
					grid.NewColumn({fname: "max_percent", width: 100, fixedWidth:false});
				});
			});
		}
	}));
};
