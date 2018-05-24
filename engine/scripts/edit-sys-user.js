// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-budget.js
//==================================================================================================
function BudgetEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// labelWidth: 125,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "engine/sys-users",
		// postBack: "sys-users",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("status_code_id", {label:"Status", numeric:true, readonly:false})
					.setprops("user_name", {label:"User Name", required:true, readonly:false})
					.setprops("last_name", {label:"Last Name", required:true})
					.setprops("middle_name", {label:"Middle Name", required:false})
					.setprops("first_name", {label:"First Name", required:false})
					.setprops("designation", {label:"Designation", required:false})
					.setprops("email", {label:"Email", required:false})
					.setprops("phone_no", {label:"Phone No.", required:false})
				}
			);
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Login", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddEdit({ID: "user_name"}, {readonly:editor.Dataset.get("id") > 0});
						editor.AddEdit({ID: "designation"});
					});
					
					editor.AddGroup("Name", function(editor) {
						editor.AddEdit({ID: "last_name"});
						editor.AddEdit({ID: "middle_name"});
						editor.AddEdit({ID: "first_name"});
					});
					
					editor.AddGroup("COntacts", function(editor) {
						editor.AddEdit({ID: "email"});
						editor.AddEdit({ID: "phone_no"});
					});
					
					editor.AddGroup("Options", function(editor) {
						editor.AddRadioButton("status_code_id", {
							key: "id",
							value: "value",
							data: [
								{id:10, value:"Active"},
								{id:0, value:"Inactive"}
							]
						});
					});
					
					editor.Dataset.Events.OnChanged.add(function(dataset, columnName) {
						if(columnName == "status_code_id") {
							// console.log(editor)
							editor.SetReadonly("user_name", dataset.get(columnName) == 10);
							editor.SetVisible("middle_name", dataset.get(columnName) == 10);
						}
					});
				});
				
				editor.NewSubSelectionView("Role Assignment", 300, "roles", RolesLookupView);
			});
		}
	});
}; 
