// ****************************************************************************************************
// File name: edit-address.js
// Last modified on
// 
// ****************************************************************************************************
function ContactsEdit(params){
	// console.log(params)
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "contacts",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true})
					.setprops("full_name", {label:"Contact Name", required:true})
					.setprops("title", {label:"Title"})
					.setprops("department", {label:"Department"})
					.setprops("position", {label:"Position"})
					.setprops("phone", {label:"Phone No."})
					.setprops("mobile", {label:"Mobile No."})
					.setprops("fax", {label:"Fax No."})
					.setprops("email", {label:"Email Address"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Personal Data", function(editor) {
						editor.AddEdit("full_name");
						editor.AddListBox("title", {
							key: "id",
							value: "value",
							data: [
							{id: "Mr", value: "Mr"},
							{id: "Ms", value: "Ms"},
							{id: "Mrs", value: "Mrs"},
							{id: "Dr. (Mr)", value: "Dr. (Mr)"},
							{id: "Dr. (Mrs)", value: "Dr. (Mrs)"},
							{id: "Master", value: "Master"},
							{id: "Miss", value: "Miss"}
							]
						});
						editor.AddEdit("department");
						editor.AddEdit("position");
					});
					
					editor.AddGroup("Contact Numbers", function(editor) {
						editor.AddEdit("phone");
						editor.AddEdit("mobile");
						editor.AddEdit("fax");
						editor.AddEdit("email");
					});
			});
		}
	});
}; 
