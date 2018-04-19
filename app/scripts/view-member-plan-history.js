// ****************************************************************************************************
// Last modified on
// 03-OCT-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-member-plan-history.js
//==================================================================================================
function MemberPlanHistoryView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "plan-history",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/member-plan-history";
				
				// grid.options.viewType = "cardview";
				// grid.options.hideHeader = true;
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("member_id", viewParams.requestParams.member_id, {numeric:true})
						// .addColumn("sort", "create_date")
						// .addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("sequence_no", {label:"#"})
						.setprops("flag", {label:"Flag"})
						.setprops("history_type", {label:"Type"})
						.setprops("plan_code", {label:"Plan"})
						.setprops("sub_product", {label:"Sub-Product"})
						.setprops("start_date", {label:"Start Date", type:"date"})
						.setprops("end_date", {label:"End Date", type:"date"})
						.setprops("cancelation_date", {label:"Cancelation Date", type:"date"})
						.setprops("reinstatement_date", {label:"Reinstatement Date", type:"date"})
						.setprops("extension_date", {label:"Extension Date", type:"date"})
						.setprops("renewal_date", {label:"Renewal Date", type:"date"})
						.setprops("rcd", {label:"RCD", type:"date"})
						.setprops("wait_period_start_date", {label:"Wait Period Start Date", type:"date"})
						.setprops("wait_period_days", {label:"Wait (Days)", numeric:true})
						.setprops("wait_period_months", {label:"Wait (Months)", numeric:true})
						.setprops("prorate_amount", {label:"ProRate Benefit", numeric:true, type:"money", format:"00"})
						.setprops("emergency_amount", {label:"Emergency Benefit", numeric:true, type:"money", format:"00"})
						
						.setprops("create_user", {label:"User"})
						.setprops("create_user_name", {label:"Created By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						
						.setprops("update_user", {label:"User"})
						.setprops("update_user_name", {label:"Updated By"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-vip", grid.dataset.get("vip_flag"))
					row.attr("x-blacklisted", grid.dataset.get("blacklisted_flag"))
				});	
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "sequence_no", width: 30});
					grid.NewColumn({fname: "flag", width: 50});
					grid.NewColumn({fname: "history_type", width: 50});
					grid.NewColumn({fname: "plan_code", width: 100});
					grid.NewColumn({fname: "sub_product", width: 100});
					grid.NewColumn({fname: "start_date", width: 100});
					grid.NewColumn({fname: "end_date", width: 100});
					grid.NewColumn({fname: "cancelation_date", width: 100});
					grid.NewColumn({fname: "reinstatement_date", width: 100});
					grid.NewColumn({fname: "extension_date", width: 100});
					grid.NewColumn({fname: "renewal_date", width: 100});
					grid.NewColumn({fname: "rcd", width: 100});
					grid.NewColumn({fname: "wait_period_start_date", width: 100});
					grid.NewColumn({fname: "wait_period_days", width: 100});
					grid.NewColumn({fname: "wait_period_months", width: 100});
					grid.NewColumn({fname: "prorate_amount", width: 100});
					grid.NewColumn({fname: "create_date", width: 150});
					grid.NewColumn({fname: "create_user_name", width: 100});
					grid.NewColumn({fname: "update_date", width: 150});
					grid.NewColumn({fname: "update_user_name", width: 100});
					
					// grid.NewColumn({fname: "create_user", width: 150});
					// grid.NewColumn({fname: "create_date", width: 150});
				});
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					
				});
			});
		}
	}));
};
