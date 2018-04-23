// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-service-status-codes.js
//==================================================================================================
function ServiceStatusCodesEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		labelWidth: 130,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url:("?service_type={0}&code={1}").format(params.statusCode, params.code),
		postBack: "app/service-status-details",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			data.Columns
				.setprops("code", {label:"Code", numeric:false, key:true})
				.setprops("service_type", {label:"Service Type...", readonly:sender.mode === "edit"})	
				// .setprops("main_status", {label:"Main Status", upperCase:true, required:true,
				.setprops("status_code", {label:"Main Status", upperCase:true, required:true,
					getText: function(column, value) {
							return column.dataset.get("main_status");
						},
						onChange: function(column) {
							column.dataset.set("main_status", column.lookupDataset.Methods.call("lookupValue"));
						}
				})
				.setprops("sub_status_code", {label:"Sub-Status Code", maxLength:3, upperCase:true, required:true, readonly:sender.mode === "edit"})
				.setprops("sub_status", {label:"Sub-Status Description", required:true})
				.setprops("is_system", {label:"System"})
				.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("Service Status Codes", function(editor, tab) {
					editor.AddGroup("Status", function(editor) {
						//editor.AddEdit("service_type");
						editor.AddLookup("status_code", {width:400, height:250, disableEdit:true, init:ServiceStatusLookup});
					});
					editor.AddGroup("Sub-Status", function(editor) {
						editor.AddEdit("sub_status_code");
						editor.AddEdit("sub_status");
					});
					editor.AddGroup("Options", function(editor) {
						editor.AddRadioButton("is_system", {
							key: "id",
							value: "value",
							data: [
								{id: "1", value: "Internal"},
								{id: "0", value: "Default"}
							]
						});
						editor.AddRadioButton("is_active", {
							key: "id",
							value: "value",
							data: [
								{id: "1", value: "Active"},
								{id: "0", value: "Inactive"}
							]
						});
					}); 
				});
			});
		}
	});
}; 