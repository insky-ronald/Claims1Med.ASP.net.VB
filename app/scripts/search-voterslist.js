// ****************************************************************************************************
// Last modified on
// 13-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: search-voterslist.js
//==================================================================================================
function VotersListSearch(params){
	return new FormEditor({
		id: params.id,
		dataset: params.dataset,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		showToolbar: params.showToolbar,
		url: params.url,
		postBack: "masterpolicies",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				// data.Columns
					// .setprops("id", {label:"ID", numeric:true, key: true})
					// .setprops("broker_name", {label:"Broker", required:true})
					// .setprops("policy_number", {label:"Policy No.", required:true})
					// .setprops("underwriting_currency", {label:"U/W Currency"})
					// .setprops("underwriting_year", {label:"U/W Year"})
					// .setprops("effective_date", {label:"Effective Date", type:"date", required:true})
					// .setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
					// .setprops("status", {label:"Status"})
					// .setprops("expired", {label:"Expired"})
					// .setprops("plan_name", {label:"Type", required:true})
					// .setprops("plan_description", {label:"Description", required:true})
					// .setprops("plan_currency", {label:"Currency", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					// editor.AddGroup("Master Policy", function(editor) {
						// editor.AddEdit("policy_number");
						// editor.AddEdit("plan_name");
						// editor.AddEdit("plan_description");
						// });
						
					// editor.AddGroup("Dates", function(editor) {
						// editor.AddEdit({ID: "effective_date"});
						// editor.AddEdit({ID: "expiry_date"});
						// editor.AddEdit({ID: "underwriting_year"});
					// });
				});
				
				// editor.NewGroupEdit("Other", function(editor, tab) {
					// editor.AddGroup("Dates", function(editor) {
						// editor.AddEdit({ID: "effective_date"});
						// editor.AddEdit({ID: "expiry_date"});
						// editor.AddEdit({ID: "underwriting_year"});
					// });
				// });
				
				// editor.NewContainer("Test Container", function(editor, tab) {
				// });
			});
		}
	});
}; 
