// ****************************************************************************************************
// Last modified on
// 16-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-saved-report.js
//==================================================================================================
function SavedReportEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		url: ("?id={0}&report_type_id={1}").format(params.id, params.reportTypeId),
		postBack: "engine/sys-saved-reports",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {				
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("report_type_id", {numeric:true})
					.setprops("name", {label:"Name"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Saved Report", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddMemo({ID: "name"});
					});
				});
			});
		}
	});
}; 
