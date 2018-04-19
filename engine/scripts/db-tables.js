// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: users.js
//==================================================================================================
function CreateSubPage(params){
	return new Users(params)
};

Class.Inherits(Users, SubPageTable);
function Users(Params) {
	Users.prototype.parent.call(this, Params);
};

Users.prototype.classID = "Users";
Users.prototype.dataSource = "db-tables";
Users.prototype.showHeader = true;
Users.prototype.showToolbar = true;
// Users.prototype.horzScroll = true; // at 870px width show the scrollbar
Users.prototype.showPager = true;
Users.prototype.showSummary = false;

Users.prototype.InitializeGrid = function(grid) {
	Users.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	grid.options.cardView = false;
	grid.options.autoScroll = false;
	grid.options.allowSort = true;
	grid.options.showSelection = false;
	grid.options.showBand = false;
	grid.options.simpleSearch = true;
	grid.options.simpleSearchField = "filter";
	
	grid.Events.OnInitRow.add(function(grid, row) {
		// if(!grid.dataset.get("has_password")) {
			// row.attr("x-nopassword", "1")
		// };
		// if(!grid.dataset.get("is_active")) {
			// row.attr("x-inactive", "0")
		// };
	});
	
	// grid.Methods.add("deleteConfirm", function(grid, id) {
		// return {title: "Delete user", message: ("Please confirm to delete user <b>{0}</b>.").format(id)};
		// grid.dataset.gotoKey(id);
		// return {title: "Delete user", message: ("Please confirm to delete user <b>{0}</b>.").format(grid.dataset.get("name"))};
	// });
}

Users.prototype.InitializeQuery = function(data) {
	Users.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("filter", "")
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "table_name")
		.addColumn("order", "asc")
};

Users.prototype.InitializeEditor = function(editor) {
	Users.prototype.parent.prototype.InitializeEditor.call(this, editor);
	// editor.NewGroupEdit("User", function(editor, tab) {
		// editor.AddGroup("User", function(editor) {
			// editor.AddEdit({ID: "id"});
			// editor.AddEdit({ID: "user_name"}, {readonly:true});
			// editor.AddEdit({ID: "name"});
			// editor.AddEdit({ID: "designation"});
			// editor.AddEdit({ID: "phone_no"});
		// });
	// });
};

Users.prototype.InitializeDatatable = function(data, mode) {
	Users.prototype.parent.prototype.InitializeDatatable.call(this, data, mode);
	data.Columns
		.setprops("table_name", {label:"Name", key: true, readonly:true})
		.setprops("table_type", {label:"Type", required:true})
};

Users.prototype.InitializeColumns = function(grid) {
	Users.prototype.parent.prototype.InitializeColumns.call(this, grid);
	grid.NewColumn({fname: "table_name", width: 300, allowSort: true});
	grid.NewColumn({fname: "table_type", width: 75, allowSort: true});
};

