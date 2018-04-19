// Test module this is used bu client.js and clients.js
function ClientEditData(owner, data) {
	data.Columns
		.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
		.setprops("pin", {label:"PIN", numeric:true, required:true, maxLength:4})
		.setprops("name", {label:"Name", required:true})
		.setprops("currency_code", {label:"Currency"})
		.setprops("country", {label:"Country"})
		
	return data;
};

function ClientEditor(owner, editor) {
	editor.NewGroupEdit("Client", function(editor, tab) {
		editor.AddEdit({ID: "id"});
		editor.AddEdit({ID: "pin"});
		editor.AddEdit({ID: "name"});
		editor.AddLookup("currency_code", {width: 400,height: 250,init: CurrencyLookup});
		// editor.AddEdit({ID: "currency_code"});
	});
	
	return editor;
};
