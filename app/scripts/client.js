// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: client.js
//==================================================================================================
function CreateSubPage(params){
	return new FormEditor({
		id: params.id,
		container: params.container,
		url: params.url,
		postBack: "clients",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("pin", {label:"PIN", numeric:true, required:true, maxLength:4})
					.setprops("name", {label:"Name", required:true})
					.setprops("currency_code", {label:"Currency"})
					.setprops("country", {label:"Country"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("", function(editor, tab) {
					desktop.GetSvg(tab.container, "table-edit", 24).css("fill", "#92846A");
					
					editor.AddGroup("Client", function(editor) {
						editor.AddEdit({ID: "id"});
						editor.AddEdit({ID: "pin"});
						editor.AddEdit({ID: "name"});
						editor.AddLookup("currency_code", {width: 400,height: 250,init: CurrencyLookup});
					});
				});
			});
		}
	});
}; 
