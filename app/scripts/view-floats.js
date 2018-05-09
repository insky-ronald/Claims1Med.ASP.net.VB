// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-floats.js
//==================================================================================================
function FloatsView(params){	
	function MasterKey() {
		if(params.getMasterID) {
			return params.getMasterID()
		} else {
			return params.requestParams.name_id
		}
	};
	return new jGrid($.extend(params, {
		paintParams: {
			css: "floats",
			toolbar: {theme: "svg"}
		},		
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/floats";
				grid.options.editNewPage = false;
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
						.addColumn('client_id', MasterKey(), {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Float Code", numeric:false, key:true})
						.setprops("underwriting_year", {label:"U/W Year"})	
						.setprops("float_name", {label:"Description"})	
						.setprops("currency_code", {label:"Currency"})	
						
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewBand({capion: "General"}, function(band) {
						band.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "underwriting_year", width: 100, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "float_name", width: 400, allowSort: true, fixedWidth:true});
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
