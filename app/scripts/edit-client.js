/****************************************************************************************************
	File name: edit-client.js
	Last modified on
	
	Called from client-details.js
****************************************************************************************************/
function ClaimDetailsEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: desktop.dbClient,
		mode: desktop.dbClient.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		url: "?id=" + desktop.dbClient.get("id"),
		postBack: viewParams.postBack,
		init: function(editor) {
			editor.Events.OnInitData.add(function(group, columnName) {
			});
			
			editor.Events.OnPostSuccess2.add(function(editor, returnData) {
				if (returnData.mode == "new" && returnData.result.id) {
					location.href = __client(returnData.result.id, true);
				}
			});

			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"General", icon:{name:"view-list", color:"forestgreen"}},
					function(editor, tab) {
						editor.AddGroup("General", function(editor) {
							editor.AddEdit("name");
							editor.AddLookup("client_currency_code", {width:400, height:300, disableEdit:true, init:CurrenciesLookup});
							editor.AddRadioButton("status_code", {
								key: "id",
								value: "value",
								data: [
									{id:"A", value:"Yes"},
									{id:"X", value:"No"}
								]
							});
						});
						editor.AddGroup("Reference Numbers", function(editor) {
							editor.AddEdit("sun_code");
							editor.AddEdit("soa_prefix");
							editor.AddEdit("prefix_code");
						});
						// editor.AddGroup("Large Loss Limit", function(editor) {
							// editor.AddEdit("large_loss_amount");
						// });
						editor.AddGroup("Hotline Numbers", function(editor) {
							editor.AddEdit("hotline");
						});
						editor.AddGroup("Update Log", function(editor) {
							editor.AddTimeStamp({ID:"create_date", name:"create_user_name", label:"Created by"});
							editor.AddTimeStamp({ID:"update_date", name:"update_user_name", label:"Last updated by"});
						});
					}
				);
			});
		}
	});
};
