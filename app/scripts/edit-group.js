// PopupEditor: refer to engine\edit-default.js
function GroupEdit(params){
	return PopupEditor(params, {
		postBack: "groups",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				var newRecord = !data.data[0].id;
				data.Columns
					.setprops("id", {label:"ID", key: true, required:true, maxLength:10, readonly:!newRecord})
					.setprops("group_name", {label:"Name", required:true})
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
