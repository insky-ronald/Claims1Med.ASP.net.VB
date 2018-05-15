function PaymentsByBatchView(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "payment-batches",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/payments";
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = false;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("batch_id", params.batch_id, {numeric:true})
						.addColumn("sort", "id")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
					    .setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("client_name", {label:"Client"})
						.setprops("float_name", {label:"Float"})
						.setprops("payee_name", {label:"Payee"})
						.setprops("payment_mode", {label:"Mode"})
						.setprops("currency_code", {label:"SCY"})
						.setprops("amount", {label:"Amount", numeric:true, type:"money", format:"00"})
						.setprops("base_currency_code", {label:"BCY"})
						.setprops("base_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
						grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "client_name", width: 200, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "float_name", width: 200, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "payee_name", width: 200, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "payment_mode", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "currency_code", width: 75, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "amount", width: 100, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "base_currency_code", width: 75, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "base_amount", width: 100, allowSort: true, fixedWidth:true});
				});
			});
		}
	});	
};