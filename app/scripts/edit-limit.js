// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-limit.js
//==================================================================================================
function LimitEdit(params){
	console.log(params)
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		url: ("?id={0}&schedule_id={1}").format(params.id, params.schedule_id),
		postBack: "app/limits",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {				
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("rule_code", {label:"Rule"})
					.setprops("currency_code", {label:"Currency", readonly:true})
					.setprops("max_amount", {label:"Amount", numeric:true, type:"money", format:"00"})
					.setprops("max_units", {label:"Units", numeric:true, type:"money", format:"0"})
					.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
					.setprops("max_percent", {label:"Percent", numeric:true, type:"money", format:"00"})
					.setprops("unit_specification", {label:"Unit Spec"})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					editor.AddGroup("Limit Type", function(editor) {
						editor.AddEdit({ID: "rule_code"});
					});
					
					editor.AddGroup("Unit Limit", function(editor) {
						editor.AddEdit({ID: "max_units"});
						editor.AddEdit({ID: "unit_specification"});
					});
					
					editor.AddGroup("Amount Limit", function(editor) {
						editor.AddEdit({ID: "currency_code"});
						editor.AddEdit({ID: "deductible"});
						editor.AddEdit({ID: "max_amount"});
					});
					
					editor.AddGroup("Percent Limit", function(editor) {
						editor.AddEdit({ID: "max_percent"});
					});
				});
			});
		}
	});
}; 
