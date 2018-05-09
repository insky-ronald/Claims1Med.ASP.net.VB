// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-plans.js
//==================================================================================================
function PlansView(params){	
	function MasterKey() {
		if(params.getMasterID) {
			return params.getMasterID()
		} else {
			return params.requestParams.client_id
		}
	};
	return new jGrid($.extend(params, {
		paintParams: {
			css: "plans",
			toolbar: {theme: "svg"}
		},		
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/plans";
				grid.options.editNewPage = true;
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = false;
				// grid.search.mode = "advanced";
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn('product_code', MasterKey(), {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Plan Code", numeric:false, key:true})
						.setprops("product_code", {label:"Product Code"})	
						.setprops("plan_name", {label:"Plan Name"})	
						.setprops("currency_code", {label:"Currency"})	
						
				});	
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __plan(id, true)
				});

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({capion: "General"}, function(band) {
						band.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "product_code", width: 200, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "plan_name", width: 400, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "currency_code", width: 100, allowSort: true, fixedWidth:true});
					})
				});
				
				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// return {
						// title: "Delete Plan",
						// message: ('Please confirm to delete plan "<b>{0}</b>"').format(grid.dataset.lookup(id, "product_name"))
					// }
				// });
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_id"))
				});
			});
		}
	}));	
};
