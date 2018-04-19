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
Users.prototype.dataSource = "users";
Users.prototype.showHeader = true;
Users.prototype.showToolbar = true;
// Users.prototype.horzScroll = true; // at 870px width show the scrollbar
Users.prototype.showPager = true;
Users.prototype.showSummary = false;
Users.prototype.showFooter = true;

Users.prototype.AfterPaint = function(params) {
	Users.prototype.parent.prototype.AfterPaint.call(this, params);
	
	// new JPageControl({
		// owner: this,
		// container: this.Painter.footer,
		// Painter: {
			// autoHeight: false,
			// theme: "main"
		// },
		// init: function(pg) {
			// pg.NewTab("Groups", {
				// OnCreate: function(tab) {
					// pg.owner.GroupsView = GroupsView({
						// container: tab.content
					// })
				// }
			// })
		// }
	// });
};

Users.prototype.paintSubDataView = function(grid) {
	var self = this;
	var container = CreateElement("div", this.Painter.footer, "", "user-groups-container");
	this.GroupsView = GroupsView({
		user_name: grid.dataset.get("user_name"),
		container: container
	})
	
	return;
	new JPageControl({
		owner: this,
		container: this.Painter.footer,
		Painter: {
			autoHeight: false,
			theme: "main"
		},
		init: function(pg) {
			pg.NewTab("Groups", {
				OnCreate: function(tab) {
					// pg.owner.GroupsView = GroupsView({
					self.GroupsView = GroupsView({
						user_name: grid.dataset.get("user_name"),
						container: tab.content
					})
				}
			})
			
			pg.Events.OnAfterPaint.add(function(pg) {
				// pg.ShowTabs(false);
			});
		}
	});
};

Users.prototype.InitializeData = function(data) {
	Users.prototype.parent.prototype.InitializeData.call(this, data);
	
	// alerts(self.grid.dataset);
};

// Users.prototype.RefreshUserGroupsView = function() {
	// this.GroupsView.dataset.Events.OnUpdateUserGroups.trigger(this.grid.dataset.get("user_name"));
// };

Users.prototype.InitializeGrid = function(grid) {
	Users.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	// grid.options.cardView = false;
	grid.options.cardView = true;
	grid.options.autoScroll = true;
	grid.options.allowSort = true;
	grid.options.showSelection = false;
	grid.options.showBand = false;
	grid.options.simpleSearch = true;
	grid.options.simpleSearchField = "filter";
	
	grid.Events.OnInitRow.add(function(grid, row) {
		if(!grid.dataset.get("has_password")) {
			row.attr("x-nopassword", "1")
		};
		if(!grid.dataset.get("is_active")) {
			row.attr("x-inactive", "0")
		};
	});
	
	grid.Events.OnInitCard.add(function(grid, card) {
		// var top = CreateElement("div", card).attr("card-sec", "top")
		CreateElement("div", card).attr("card-sec", "name").html(grid.dataset.text("name"));
		CreateElement("div", card).attr("card-sec", "user_name").html(grid.dataset.text("user_name"));
		CreateElement("div", card).attr("card-sec", "designation").html(grid.dataset.text("designation"));
		CreateElement("div", card).attr("card-sec", "phone_no").html(grid.dataset.text("phone_no"));
			// CreateElement("a", name).html(grid.dataset.text("name"))
	});
	
	grid.Methods.add("deleteConfirm", function(grid, id) {
		// return {title: "Delete user", message: ("Please confirm to delete user <b>{0}</b>.").format(id)};
		grid.dataset.gotoKey(id);
		return {title: "Delete user", message: ("Please confirm to delete user <b>{0}</b>.").format(grid.dataset.get("name"))};
	});
	
	// grid.Events.AfterRepainContent.add(function(grid) {
		// if(!grid.owner.GroupsView) {
			// grid.owner.paintSubDataView(grid);
		// };
		
		// grid.dataset.Events.OnMoveRecord.add(function(dataset, params) {
			// grid.owner.GroupsView.dataset.Events.OnUpdateUserGroups.trigger(grid.dataset.get("user_name"));
		// });
	// });
}

Users.prototype.InitializeQuery = function(data) {
	Users.prototype.parent.prototype.InitializeQuery.call(this, data);
	data
		.addColumn("filter", "")
		.addColumn("page", 1, {numeric:true})
		.addColumn("pagesize", 25, {numeric:true})
		.addColumn("sort", "user_name")
		.addColumn("order", "asc")
};

Users.prototype.InitializeEditor = function(editor) {
	Users.prototype.parent.prototype.InitializeEditor.call(this, editor);
	editor.NewGroupEdit("User", function(editor, tab) {
		editor.AddGroup("User", function(editor) {
			editor.AddEdit({ID: "id"});
			editor.AddEdit({ID: "user_name"}, {readonly:true});
			editor.AddEdit({ID: "name"});
			editor.AddEdit({ID: "designation"});
			editor.AddEdit({ID: "phone_no"});
		});
	});
	
	editor.NewGroupEdit("Groups", function(editor, tab) {
	});
};

Users.prototype.InitializeDatatable = function(data, mode) {
	Users.prototype.parent.prototype.InitializeDatatable.call(this, data, mode);
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("user_name", {label:"User Name", required:true})
		.setprops("name", {label:"Full Name", required:true})
		.setprops("designation", {label:"Designation"})
		.setprops("phone_no", {label:"Phone No."})
};

Users.prototype.InitializeColumns = function(grid) {
	Users.prototype.parent.prototype.InitializeColumns.call(this, grid);
	if(grid.options.cardView) {
		grid.NewColumn({fname: "user_name", width: 125, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "name", width: 125, allowSort: true, fixedWidth: true});
		grid.NewColumn({fname: "", width: "100%", allowSort: false});
	} else {
		grid.NewColumn({fname: "user_name", width: 150, allowSort: true});
		grid.NewColumn({fname: "name", width: 300, allowSort: true});
		// grid.NewColumn({fname: "designation", width: 200, allowSort: true});
		// grid.NewColumn({fname: "phone_no", width: 150, allowSort: true});
		// grid.NewColumn({fname: "", width: "100%", allowSort: false});
	}
};

