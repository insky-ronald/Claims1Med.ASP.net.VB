// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-policies.js
//==================================================================================================
function PoliciesView(params){
	var name = "app/policies";
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "policies"
		},
		
		init: function(grid) {			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name;
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				grid.options.showSelection = false;
				grid.options.showBand = false;
				grid.options.showBand = false;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				grid.optionsData.editCallback = function(grid, id) {
					__masterpolicy(id);
				};
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "policy_no")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("policy_no", {label:"Policy No."})
						.setprops("policy_holder", {label:"Policy Holder"})
						.setprops("client_name", {label:"Client Name"})
						.setprops("product_name", {label:"Product"})
						.setprops("issue_date", {label:"Issue Date", type:"date"})
						.setprops("start_date", {label:"Effective Date", type:"date"})
						.setprops("end_date", {label:"Expiry Date", type:"date"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"open", float: "left"});
					
					grid.NewColumn({fname: "policy_no", width: 125, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "policy_holder", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "client_name", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "product_name", width: 250, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "issue_date", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "start_date", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "end_date", width: 150, allowSort: true, fixedWidth:false});
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Policy",
					message: ('Please confirm to delete policy "<b>{0}</b>"').format(grid.dataset.lookup(id, "policy_no"))
				}
			});
			});
		}
	});	
};
