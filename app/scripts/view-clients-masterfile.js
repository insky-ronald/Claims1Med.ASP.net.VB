// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-clients-masterfile.js
//==================================================================================================
function ClientMasterfileView(params){
	var name = "app/clients-masterfile";
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "clients-masterfile"
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
					__client(id);
				};
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key:true})
						.setprops("account_code", {label:"Account Code"})
						.setprops("client_currency_code", {label:"Currency"})
						.setprops("name", {label:"Name"})
						.setprops("prefix", {label:"Prefix"})
						.setprops("soa_prefix", {label:"SOA Prefix"})
						.setprops("large_loss_limit", {label:"Large Loss Limit Amount", numeric:true})
						.setprops("hotline", {label:"Hotline"})
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command:"open", float: "left"});
					
					grid.NewColumn({fname: "account_code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "client_currency_code", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "name", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "prefix", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "soa_prefix", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "large_loss_limit", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "hotline", width: 150, allowSort: true, fixedWidth:false});
				});
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code"))
				});
				
				grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete Client",
					message: ('Please confirm to delete client "<b>{0}</b>"').format(grid.dataset.lookup(id, "name"))
				}
			});
			});
		}
	});	
};
