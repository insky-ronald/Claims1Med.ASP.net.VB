// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-permissions.js
// uses edit-permission.js
//==================================================================================================
function PermissionsView(params){
	var roleID = params.requestParams.role_id;
	
	return DefaultView(params, {
		url: "engine/sys-permissions",
		css: "sys-permissions",
		initRequestParams: function(grid, requestParams) {
			// console.log(params.requestParams.role_id)
			requestParams.role_id = params.requestParams.role_id;
		},
		initData: function(grid, data) {
			data.Columns
				.setprops("action_id", {label:"ID", numeric:true, key: true})
				.setprops("role_id", {label:"Role ID", numeric:true})
				.setprops("code", {label:"Code"})
				.setprops("action_name", {label:"Action"})
				.setprops("rights_names", {label:"Permissions",
					getTextx: function(column) {
						var names = column.raw().split(",");
						var ids = column.dataset.get("rights").split(",");
						var permissions = [];
						if(column.dataset.get("permissions") != "")
							permissions = column.dataset.get("permissions").split(",");
						
						var container = CreateElement("div");
						var items = CreateElement("ul", container).attr("x-rights", "1")
						for(var i = 0; i < names.length; i++) {
							var name = CreateElement("li", items).html(names[i].trim());
							var id = ids[i];
							if(permissions.indexOf(id) > -1)
								name.attr("x-active", 1)
							else
								name.attr("x-active", 0)
						};
						
						return container.html();
					}
				})
		},
		onMaterDatasetUpdate: function(grid, requestParams) {
			// we expect grid.optionsData.masterDataset primary key to be the role_id
			requestParams.role_id = grid.optionsData.masterDataset.text(grid.optionsData.masterDataset.primaryKey);
		},
		initGrid: function(grid) {
			grid.options.showPager = false;
			grid.options.simpleSearch = false;
			grid.options.showFocused = false;
		},
		initRow: function(grid, row) {
			row.attr("x-type", grid.dataset.get("action_type_id"))
		},
		// getCommandIcon: function(grid, column) {
			// if(column.command == "edit")
				// return "security"
			// else
				// return "";
		// },
		getCommandHint: function(grid, column) {
			if(column.command == "edit")
				return "Assign permissions"
			else
				return "";
		},
		initColumns: function(grid) {
			grid.NewColumn({fname: "action_id", width: 75, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "code", width: 150, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "action_name", width: 175, allowSort: false, fixedWidth:true});
			grid.NewColumn({fname: "rights_names", width: 1024, allowSort: false, fixedWidth:false, 
				drawContent: function(cell, column) {
					cell.html("");
					var names = column.dataset.text("rights_names").split(",");
					var ids = column.dataset.text("rights").split(",");
					var permissions = [];
					if(column.dataset.get("permissions") != "")
						permissions = column.dataset.get("permissions").split(",");
					
					var container = CreateElement("div", cell);
					var items = CreateElement("ul", container).attr("x-rights", "1");
					for(var i = 0; i < names.length; i++) {
						var name = CreateElement("li", items).html(names[i].trim());
						var id = ids[i];
						if(permissions.indexOf(id) > -1)
							name.attr("x-active", 1)
						else
							name.attr("x-active", 0)
					};
				}
			});
		},
		deleteConfirm: function(grid, id) {
			return {
				title: "Delete Action",
				message: ('Please confirm to delete action "<b>{0}</b>"').format(grid.dataset.lookup(id, "action_name"))
			}
		},
		editProc: PermissionEdit,
		initEdit: function(params) {		
			// ("?id={0}&role_id={1}").format(params.id, params.requestParams.role_id);
			// ("?id={0}&role_id={1}").format(params.id, params.requestParams.role_id);
			params.url = ("?id={0}&role_id={1}").format(params.id, roleID);
		}
	});
};
