// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-client-products.js
//==================================================================================================
function ClientProductsGrid(params){	
	return new jGrid($.extend(params, {
		paintParams: {
			css: "client-products",
			toolbar: {theme: "svg"}
		},		
		
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/client-products";
				grid.options.editNewPage = true;
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.showBand = true;
				grid.search.visible = false;
				// grid.search.mode = "advanced";
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
					    .addColumn('client_id', params.clientID, {numeric:true})
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "product_name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", numeric:false, key:true})
						.setprops("product_name", {label:"Product Name"})
						// .setprops("client_name", {label:"Client Name"})
						.setprops("float_name", {label:"Float"})
						.setprops("claim_reference_name1", {label:"Reference 1"})
						.setprops("claim_reference_name2", {label:"Reference 2"})
						.setprops("claim_reference_name3", {label:"Reference 3"})
						.setprops("member_reference_name1", {label:"Reference 1"})
						.setprops("member_reference_name2", {label:"Reference 2"})
						.setprops("member_reference_name3", {label:"Reference 3"})
				});	
				
				grid.methods.add("editPageUrl", function(grid, id) {
					return __product(id, true)
				});

				grid.Events.OnInitColumns.add(function(grid) {	
					grid.NewBand({capion: "Product Details"}, function(band) {
						band.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "product_name", width: 300, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "client_name", width: 200, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "float_name", width: 200, allowSort: true, fixedWidth:true});
					})
					grid.NewBand({capion: "Claim References"}, function(band) {
						band.NewColumn({fname: "claim_reference_name1", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "claim_reference_name2", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "claim_reference_name3", width: 150, allowSort: true, fixedWidth:true});
					})	
					grid.NewBand({capion: "Member References"}, function(band) {
						band.NewColumn({fname: "member_reference_name1", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "member_reference_name2", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "member_reference_name3", width: 150, allowSort: true, fixedWidth:false});
					})
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Product",
					message: ('Please confirm to delete product "<b>{0}</b>"').format(grid.dataset.lookup(id, "product_name"))
				}
			});
			});
		}
	});	
};
