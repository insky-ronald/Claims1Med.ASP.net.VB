// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-masterpolicy.js
//==================================================================================================
function MasterPolicyEdit(params){
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
		postBack: "masterpolicies",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				// console.log("editor.Events.OnInitData")
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true})
					.setprops("sequence_no", {label:"Sequence #", numeric:true})
					.setprops("broker_name", {label:"Broker", required:true})
					.setprops("policy_number", {label:"Policy No.", required:true})
					.setprops("underwriting_currency", {label:"U/W Currency"})
					.setprops("underwriting_year", {label:"U/W Year", required:true})
					.setprops("effective_date", {label:"Effective Date", type:"date", required:true})
					.setprops("expiry_date", {label:"Expiry Date", type:"date", required:true})
					.setprops("status", {label:"Status"})
					.setprops("expired", {label:"Expired"})
					.setprops("plan_name", {label:"Type", required:true})
					// .setprops("plan_description", {label:"Description", type:"memo"})
					.setprops("plan_description", {label:"Description", required:true})
					.setprops("plan_currency", {label:"Currency", required:true})
					.setprops("copay_rate", {label:"Co-Payment", numeric:true, type:"money", format:"00"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				// console.log("editor.Events.OnInitEditor")
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Text", function(editor) {
						editor.AddEdit("policy_number");
						editor.AddEdit("plan_name");
						editor.AddEdit("plan_description");
					});
					
					editor.AddGroup("Lookup", function(editor) {
						editor.AddLookup("plan_currency", {width: 400,height: 300,init: CurrenciesView});
						editor.AddLookup("underwriting_currency", {width: 400, height: 300,init: CurrenciesView});
						editor.AddContainer("underwriting_currency", {width: 400, height: 300,init: function(params) {
							
						}});
					});
						
					editor.AddGroup("Dates", function(editor) {
						editor.AddEdit({ID: "effective_date"});
						editor.AddEdit({ID: "expiry_date"});
						// editor.AddEdit({ID: "underwriting_year"});
						// editor.AddEdit("underwriting_year");
					});
					
					editor.AddGroup("Numeric", function(editor) {
						editor.AddEdit("id");
						editor.AddNumeric("underwriting_year");
						editor.AddEdit("sequence_no");
						editor.AddEdit("copay_rate");
					});
					
					editor.AddGroup("Radio Buttons", function(editor) {
						editor.AddRadioButton("expired", {
							key: "id",
							value: "value",
							data: [
								{id:true, value:"Yes"},
								{id:false, value:"No"}
							]
						});
						
						editor.AddRadioButton("sequence_no", {
							key: "id",
							value: "value",
							data: [
								{id:0, value:"Zero"},
								{id:1, value:"Value 1"},
								{id:3, value:"Value 3"},
								{id:4, value:"Value 4"},
								{id:5, value:"Value 5"},
								{id:6, value:"Value 6"}
							]
						});
					});
				});
				
				editor.NewGroupEdit("Other", function(editor, tab) {
					editor.AddGroup("Dates", function(editor) {
						editor.AddDate({ID: "effective_date"});
						editor.AddDate({ID: "expiry_date"});
						editor.AddNumeric({ID: "underwriting_year"});
					});
				});
				
				editor.NewContainer("Test Container", function(editor, tab) {
				});
			});
		}
	});
}; 
