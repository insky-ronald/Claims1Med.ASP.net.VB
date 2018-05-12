function PaymentBatchesView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "payment-batches",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/claims-batches";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = false;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "batch_no")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("batch_no", {label:"Batch No.", numeric:true, key:true})
						.setprops("batch_name", {label:"Batch Name"})
						.setprops("remarks", {label:"Remarks"})
						.setprops("is_posted", {label:"Posted"})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
						grid.NewColumn({fname: "batch_no", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "batch_name", width: 200, allowSort: false, fixedWidth:true});
						grid.NewColumn({fname: "remarks", width: 200, allowSort: false, fixedWidth:true});
				});
			});
		}
	});	
};