// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-schedule-eligibles.js
//==================================================================================================
function ScheduleEligiblesView(params){
	return new jGrid($.extend(params, {
		paintParams: {
			css: "limits",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/schedule-eligibles";
				
				grid.options.horzScroll = false;
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
						.setprops("benefit_code", {label:"Code", key:true})
						.setprops("benefit", {label:"Benefit"})
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
					return {title: "Delete Limit", message: ("Please confirm to delete benefit <b>{0}</b>.").format(grid.dataset.get("benefit"))};
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "benefit_code", width: 75, fixedWidth:true});
					grid.NewColumn({fname: "benefit", width: 200, fixedWidth:false});
				});
			});
		}
	}));
};
