// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-note-types.js
//==================================================================================================
function EditNoteTypes(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		containerPadding: defaultValue(params.containerPadding, 0),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/claim-notes-types",
		url: ("?code={0}").format(params.code),
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Code", maxLength:3, upperCase:true, key: true, required:true, readonly:sender.mode === "edit"})
					.setprops("note_type", {label:"Type", maxLength:60, required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Note Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("note_type");
					});
				});
			});
		}
	});
}; 

function EditNoteSubTypes(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		containerPadding: defaultValue(params.containerPadding, 0),
		showToolbar: defaultValue(params.showToolbar, false),
		url:("?note_type={0}&code={1}").format(params.noteSubType, params.code),
		postBack: "app/note-sub-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Code", maxLength:3, upperCase:true, key: true, required:true, readonly:sender.mode === "edit"})
					.setprops("note_sub_type", {label:"Sub-Type", maxLength:60, required:true})
				
				if(params.initEdit) {
					params.initEdit(data);
				};
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Sub-Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("note_sub_type");
					});
				});
			});
		}
	});
}; 
