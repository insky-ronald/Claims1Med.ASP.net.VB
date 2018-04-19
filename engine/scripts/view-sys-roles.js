// ****************************************************************************************************
// Last modified on
// 07-MAR-2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-sys-roles.js
//==================================================================================================
function RolesView(params){
	return DefaultView(params, {
		url: "engine/sys-roles",
		css: "sys-roles",
		initSearch: function(grid, dataParams) {
			dataParams
				.addColumn("sort", "position")
				.addColumn("order", "asc")
				.addColumn("filter", "");
		},
		initData: function(grid, data) {
			data.Columns
				.setprops("id", {label:"ID", numeric:true, key: true})
				.setprops("position", {label:"Position", numeric:true})
				.setprops("role", {label:"Role"})
				.setprops("description", {label:"Description"})
		},
		initGrid: function(grid) {
		},
		initRow: function(grid, row) {
			row.attr("x-status", grid.dataset.get("status_code_id"))
		},
		getCommandIcon: function(grid, column) {
			if(column.command == "permission")
				return "security"
			else
				return "";
		},
		getCommandHint: function(grid, column) {
			if(column.command == "permission")
				return "Manage permissions"
			else
				return "";
		},
		onCommand: function(grid, params) {
			if(params.command == "permission") {
				window.open(("/sys/permission/{0}").format(params.id), "")
			}
		},
		initColumns: function(grid) {
			grid.NewCommand({command:"permission", float: "left"});
			grid.NewColumn({fname: "id", width: 50, allowSort: true, fixedWidth:true});
			grid.NewColumn({fname: "position", width: 100, allowSort: true, fixedWidth:true});
			grid.NewColumn({fname: "role", width: 200, allowSort: true, fixedWidth:true});
			grid.NewColumn({fname: "description", width: 300, allowSort: false, fixedWidth:false});
		},
		deleteConfirm: function(grid, id) {
			return {
				title: "Delete Role",
				message: ('Please confirm to delete role "<b>{0}</b>"').format(grid.dataset.lookup(id, "role"))
			}
		},
		editProc: RoleEdit,
		initEdit: function(params) {		
			params.url = ("?id={0}&test=1").format(params.id);
		}
	});
};
