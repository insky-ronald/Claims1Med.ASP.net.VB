// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-users.js
// uses edit-account.js
//==================================================================================================
function UsersView(params){
	var name = "engine/sys-users";
	var requestParams = params.requestParams;
	var year = requestParams.year ? requestParams.year : 2017;
	
	return new JDBGrid({
		params: params,
		options: {
			horzScroll: true
		},
		toolbarTheme:"svg",
		Painter: {
			css: "sys-users"
		},
		editForm: function(id, container, dialog) {
			BudgetEdit({
				url: ("?id={0}&owner_id={1}").format(id, requestParams.owner_id),
				container: container,
				containerPadding: 0,				
				showToolbar: false,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog,
				customData: {
					owner_id: requestParams.owner_id
				}
			})
		},
		init: function(grid) {
			grid.Methods.add("deleteConfirm", function(grid, id) {
				return {
					title: "Delete User",
					message: ('Please confirm to delete user "<b>{0}</b>"').format(grid.dataset.lookup(id, "full_name"))
				}
			});
			
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = name +"?"+ ObjectToRequestParams(requestParams);
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = true;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				grid.options.autoScroll = true;
				grid.options.allowSort = true;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				// grid.options.showBand = true;
				grid.options.simpleSearch = true;
				grid.options.simpleSearchField = "filter";
				// grid.options.showAdvanceSearch = false;
				// grid.options.AdvanceSearchWidth = 500;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 50, {numeric:true})
						.addColumn("sort", "user_name")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						// .addColumn("year", 2016, {numeric:true})
						// .addColumn("year", year, {numeric:true})
						// .addColumn("owner_id", requestParams.owner_id, {numeric:true})
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("user_name", {label:"User ID"})
						.setprops("full_name", {label:"Full Name"})
						.setprops("designation", {label:"Designation"})
						.setprops("role_names", {label:"Roles"})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("status_code_id"))
				});	

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "id", width: 75, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "user_name", width: 150, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "full_name", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "designation", width: 200, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "role_names", width: 300, allowSort: false, fixedWidth:false});
					// grid.NewColumn({fname: "code", width: 125, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "description", width: 250, allowSort: true, fixedWidth:true});
					// grid.NewColumn({fname: "amount", width: 150, fixedWidth:true, allowSort: false});
					// grid.NewColumn({fname: "year", width: 100, fixedWidth:true, allowSort: false});
					// grid.NewColumn({fname: "frequency2", width: 0, allowSort: false});
				});
			});
		}
	});	
};
