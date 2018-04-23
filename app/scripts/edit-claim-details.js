/****************************************************************************************************
	File name: edit-claim-details.js
	Last modified on
	
	Called from claim-details.js
****************************************************************************************************/
function ClaimDetailsEdit(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: desktop.dbClaim,
		mode: desktop.dbClaim.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		url: "?id=" + desktop.dbClaim.get("id"),
		postBack: "app/claim-details",
		init: function(editor) {
			editor.Events.OnInitData.add(function(group, columnName) {
				// console.log(columnName)
			});

			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"General", icon:{name:"view-list", color:"forestgreen"}},
					function(editor, tab) {
						editor.group.OnDatasetChanged.add(function(group, columnName) {
							if(columnName == "is_accident" || columnName === undefined) {
								var isAccident = group.dataset.get("is_accident");
								// console.log(editor)
								editor.SetVisible("is_preexisting", !isAccident);
								editor.SetVisible("first_symptom_date", !isAccident);
								editor.SetVisible("first_consultation_date", !isAccident);

								editor.SetRequired("first_symptom_date", !isAccident);
								editor.SetRequired("first_consultation_date", !isAccident);

								editor.SetVisible("accident_date", isAccident);
								editor.SetVisible("accident_code", isAccident);

								editor.SetRequired("accident_date", isAccident);
								editor.SetRequired("accident_code", isAccident);
							};
						});

						editor.AddGroup("Basic Claim Information", function(editor) {
							editor.AddEdit({ID: "id"});
							editor.AddEdit({ID: "claim_no"});
							// editor.AddEdit({ID: "claim_type"});
							editor.AddEdit({ID: "case_owner"});
							// editor.AddEdit({ID: "status"});
							editor.AddEdit({ID: "notification_date"});
						});
						
						editor.AddGroup("Reference Numbers", function(editor) {
							editor.AddEdit({ID: "hcm_reference"});
							if(desktop.dbMember.get("claim_reference1")) {
								editor.AddEdit({ID: "reference_no1"})
							}

							if(desktop.dbMember.get("claim_reference2")) {
								editor.AddEdit({ID: "reference_no2"})
							}

							if(desktop.dbMember.get("claim_reference3")) {
								editor.AddEdit({ID: "reference_no3"})
							}
						});

						editor.AddGroup("Location", function(editor) {
							editor.AddLookup("country_of_incident", {width:400, height:300, disableEdit:true, init:CountriesLookup});
						});

						// editor.AddGroup("Accident", function(editor) {
							// editor.AddRadioButton("is_accident", {
								// key: "id",
								// value: "value",
								// data: [
									// {id:1, value:"Yes"},
									// {id:0, value:"No"}
								// ]
							// });
						// });

						editor.AddGroup("Medical Condition", function(editor) {
							editor.AddRadioButton("is_accident", {
								key: "id",
								value: "value",
								data: [
									{id:1, value:"Yes"},
									{id:0, value:"No"}
								]
							});
							// editor.AddEdit({ID: "accident_date"}, {visible:editor.Dataset.get("is_accident")});
							// editor.AddEdit({ID: "accident_code"}, {visible:editor.Dataset.get("is_accident")});
							editor.AddEdit("accident_date");
							editor.AddEdit("accident_code");
							editor.AddRadioButton("is_preexisting", {
								key: "id",
								value: "value",
								data: [
									{id:1, value:"Yes"},
									{id:0, value:"No"}
								]
								// visible:!editor.Dataset.get("is_accident")
							});
							// editor.AddEdit({ID: "first_symptom_date"}, {visible:!editor.Dataset.get("is_accident")});
							// editor.AddEdit({ID: "first_consultation_date"}, {visible:!editor.Dataset.get("is_accident")});
							editor.AddEdit("first_symptom_date");
							editor.AddEdit("first_consultation_date");
						});

						if(desktop.customData.claim_id) {
							editor.AddGroup("Update Log", function(editor) {
								// editor.AddEdit({ID: "create_date"}, {noLabel:true});
								// editor.AddEdit({ID: "update_date"}, {noLabel:true});
								// editor.AddTimeStamp({ID: "update_date_name", name:"update_date"});
								editor.AddTimeStamp({ID:"create_date", name:"create_user_name", label:"Created by"});
								editor.AddTimeStamp({ID:"update_date", name:"update_user_name", label:"Last updated by"});
							});
						};
						
						// editor.AddGroup("Debug", function(editor) {
							// editor.AddEdit("plan_code");
							// editor.AddEdit("plan_code2");
						// });
					}
				);
			});
		}
	});
};
