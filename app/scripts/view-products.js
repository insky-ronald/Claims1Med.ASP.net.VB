// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-products.js
//==================================================================================================
function ProductsView(params){
	var name = "app/products";
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "products"
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
				grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				grid.optionsData.editCallback = function(grid, id) {
					__product(id);
				};
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
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
						.setprops("client_name", {label:"Client Name"})
						.setprops("float_name", {label:"Float"})
						.setprops("claim_reference_name1", {label:"Reference 1"})
						.setprops("claim_reference_name2", {label:"Reference 2"})
						.setprops("claim_reference_name3", {label:"Reference 3"})
						.setprops("member_reference_name1", {label:"Reference 1"})
						.setprops("member_reference_name2", {label:"Reference 2"})
						.setprops("member_reference_name3", {label:"Reference 3"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"open", float: "left"});
					
					var band;

                    band = grid.NewBand("Product Details");
					band.NewColumn({fname: "code", width: 100, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "product_name", width: 200, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "client_name", width: 200, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "float_name", width: 200, allowSort: true, fixedWidth:true});
					
					band = grid.NewBand("Claim References");
					band.NewColumn({fname: "claim_reference_name1", width: 150, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "claim_reference_name2", width: 150, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "claim_reference_name3", width: 150, allowSort: true, fixedWidth:true});
					
					band = grid.NewBand("Member References");
					band.NewColumn({fname: "member_reference_name1", width: 150, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "member_reference_name2", width: 150, allowSort: true, fixedWidth:true});
					band.NewColumn({fname: "member_reference_name3", width: 150, allowSort: true, fixedWidth:false});
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
