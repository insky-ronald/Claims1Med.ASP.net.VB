// ****************************************************************************************************
// Last modified on
// 16-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-report.js
//==================================================================================================
function ReportEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// containerPadding: defaultValue(params.containerPadding, 10),
		// pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		// fillContainer: defaultValue(params.fillContainer, false),
		// showToolbar: params.showToolbar,
		url: ("?id={0}").format(params.id),
		postBack: "engine/sys-reports",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {				
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, required:true, readonly:sender.mode == "edit"})
					.setprops("report_type", {label:"Name", required:true})
					.setprops("data_build_view_name", {label:"Build"})
					.setprops("data_details_view_name", {label:"View"})
					.setprops("report_totals", {label:"Totals"})
					.setprops("status_code_id", {label:"Status", numeric:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Report", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddEdit({ID: "report_type"});
						editor.AddRadioButton("status_code_id", {
							key: "id",
							value: "value",
							data: [
								{id:10, value:"Active"},
								{id:11, value:"Internal"},
								{id:0, value:"Inactive"}
							]
						});
					});
					
					editor.AddGroup("Database", function(editor) {
						editor.AddEdit({ID: "data_build_view_name"});
						editor.AddEdit({ID: "data_details_view_name"});
						editor.AddMemo({ID: "report_totals"});
					});
				});
			});
		}
	});
}; 
