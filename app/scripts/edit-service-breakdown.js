// ****************************************************************************************************
// Last modified on
// 16-SEP-2017
// ****************************************************************************************************
//==================================================================================================
// File name: edit-service-breakdown.js
//==================================================================================================
function ServiceItemEdit(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		// containerPadding: defaultValue(params.containerPadding, 10),
		// pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		// fillContainer: defaultValue(params.fillContainer, false),
		// showToolbar: params.showToolbar,
		url: ("?id={0}").format(params.id),
		postBack: "app/service-breakdown",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {				
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, required:true, readonly:sender.mode == "edit"})
					.setprops("benefit", {label:"Benefit", readonly:true, required:true})
					.setprops("benefit_code", {label:"Benefit", readonly:true, required:true})
					.setprops("estimate_units", {label:"Estimate", numeric:true, type:"money", format:"0"})
					.setprops("units", {label:"Units", numeric:true, type:"money", format:"0"})
					.setprops("units_approved", {label:"Approved", numeric:true, type:"money", format:"0"})
					.setprops("units_declined", {label:"Declined", numeric:true, type:"money", format:"0"})
					.setprops("estimate", {label:"Estimate", numeric:true, type:"money", format:"00"})
					.setprops("actual_amount", {label:"Actual", numeric:true, type:"money", format:"00"})
					.setprops("approved_amount", {label:"Approved", numeric:true, type:"money", format:"00"})
					.setprops("ex_gratia", {label:"Ex-Gratia", numeric:true, type:"money", format:"00"})
					.setprops("deductible", {label:"Deductible", numeric:true, type:"money", format:"00"})
					.setprops("declined_amount", {label:"Declined", numeric:true, type:"money", format:"00", readonly:true})
					.setprops("payable", {label:"Paid", numeric:true, type:"money", format:"00", readonly:true})
					.setprops("is_novalidate", {label:"Do Not Validate", numeric:true})
					.setprops("is_recover", {label:"Recover", numeric:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit("General", function(editor, tab) {
					sender.dataset.Events.OnChanged.add(function(dataset) {
						var exclusion  = dataset.get("is_exclusion");
						editor.SetVisible("estimate", !exclusion);
						editor.SetVisible("ex_gratia", !exclusion);
						editor.SetVisible("approved_amount", !exclusion);
						editor.SetVisible("deductible", !exclusion);
						editor.SetVisible("payable", !exclusion);
					});
					
					editor.AddGroup("Benefit", function(editor) {
						editor.AddEdit("benefit");
					});
					
					
					if (sender.dataset.get("units_required")) {
						editor.AddGroup("Units", function(editor) {
							editor.AddEdit("estimate_units");
							editor.AddEdit("units");
							editor.AddEdit("units_approved");
							editor.AddEdit("units_declined");
						});
					}
					
					editor.AddGroup("Amount", function(editor) {
						editor.AddEdit("estimate");
						editor.AddEdit("actual_amount");
						editor.AddEdit("approved_amount");
						editor.AddEdit("ex_gratia");
						editor.AddEdit("deductible");
						editor.AddEdit("declined_amount");
						editor.AddEdit("payable");
					});
					
					if (!sender.dataset.get("is_exclusion")) {
						editor.AddGroup("Other", function(editor) {
							editor.AddRadioButton("is_novalidate", {
								key: "id",
								value: "value",
								data: [
									{id:1, value:"Yes"},
									{id:0, value:"No"}
								]
							});
							editor.AddRadioButton("is_recover", {
								key: "id",
								value: "value",
								data: [
									{id:1, value:"Yes"},
									{id:0, value:"No"}
								]
							});
						});
					}
				});
			});
		}
	});
}; 
