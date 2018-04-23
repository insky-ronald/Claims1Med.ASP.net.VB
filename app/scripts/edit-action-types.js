function EditActionTypes(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		containerPadding: defaultValue(params.containerPadding, 0),
		showToolbar: defaultValue(params.showToolbar, false),
		postBack: "app/action-types",
		url: ("?code={0}").format(params.code),
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Code", maxLength:3, upperCase:true, key: true, required:true, readonly:sender.mode === "edit"})
					.setprops("action_type", {label:"Type", maxLength:60, required:true})
					.setprops("is_active", {label:"Status"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Action Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("action_type");
					});
					editor.AddGroup("Option", function(editor) {
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

function EditActionSubTypes(params) {
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		pageControlTheme: defaultValue(params.pageControlTheme, "data-entry"),
		fillContainer: defaultValue(params.fillContainer, true),
		containerPadding: defaultValue(params.containerPadding, 0),
		showToolbar: defaultValue(params.showToolbar, false),
		url:("?action_type={0}&code={1}").format(params.actionSubType, params.code),
		postBack: "app/action-sub-types",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("code", {label:"Code", maxLength:3, upperCase:true, key: true, required:true, readonly:sender.mode === "edit"})
					.setprops("action_name", {label:"Sub-Type", maxLength:60, required:true})
					.setprops("is_active", {label:"Status"})
				
				if(params.initEdit) {
					params.initEdit(data);
				};
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Action Sub-Type", function(editor) {
						editor.AddEdit("code");
						editor.AddEdit("action_name");
					});
					editor.AddGroup("Option", function(editor) {
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
