// DefaultView() refer to view-default.js
function GroupsView(params){
	var initData = function(data, isView, newRecord) {
		data.Columns
			.setprops("id", {label:"ID", key: true, required:true, maxLength:10, readonly:!newRecord})
			.setprops("group_name", {label:"Name", required:true})
	};
	
	return DefaultView(params, {
		viewID: "groups",
		toolbarTheme: "svg",
		tableName: "group",
		deletePromptName: "group_name",
		defaultSort: "group_name",
		init: function(grid) {
			grid.Events.OnInitData.add(function(grid, data) {
				initData(data, true);
			});

			grid.Events.OnInitColumns.add(function(grid) {
				grid.NewColumn({fname: "id", width: 150, allowSort: true, fixedWidth: true});
				grid.NewColumn({fname: "group_name", width: 300, allowSort: true});
			});
		},
		initEdit: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				initData(data, false, !data.data[0].id);
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Group", function(editor) {
						editor.AddText("id", {upperCase:true});
						editor.AddText("group_name");
					});
				});
			});
		}
	});	
};
