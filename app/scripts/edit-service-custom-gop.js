// ****************************************************************************************************
// File name: edit-service-gop.js
// Last modified on
// 
// ****************************************************************************************************
function ServiceCustomEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: viewParams.dataset,
		mode: viewParams.dataset.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		labelWidth: 120,
		url: "?id=" + viewParams.dataset.get("id"),
		postBack: "app/claim",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"Guarantee of Payment", icon:{name:"view-list", color:"forestgreen"}}, 
					function(editor, tab) {
						editor.group.OnDatasetChanged.add(function(group, columnName) {
							// if(columnName == "discount_type" || columnName === undefined) {
								// var discountType= parseInt(group.dataset.get("discount_type"));
								// editor.SetVisible("discount_percent", discountType == 1);
								// editor.SetVisible("discount_amount", false);
							// };
						});
						
						editor.AddGroup("Hospital and Physician", function(editor) {
							editor.AddEdit({ID: "provider_name"});
							editor.AddEdit({ID: "hospital_medical_record"});
							editor.AddEdit({ID: "doctor_name"});
							editor.AddEdit({ID: "provider_contact_person"});
							editor.AddEdit({ID: "provider_fax_no"});
						});
						
						editor.AddGroup("Admission", function(editor) {
							editor.AddEdit({ID: "start_date"});
							editor.AddEdit({ID: "end_date"});
						});
						
						editor.AddGroup("Guarantee Amount", function(editor) {
							editor.AddEdit({ID: "claim_currency_code"});
							editor.AddEdit({ID: "misc_expense"});
							editor.AddEdit({ID: "room_expense"});
							editor.AddEdit({ID: "length_of_stay"});
						});
					}
				);
			});
		}
	});
};
