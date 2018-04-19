// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-member.js
//==================================================================================================
function MemberEdit(params){
	new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			theme: "data-entry",
			autoHeight: false
		},
		init: function(pg) {
			pg.NewTab("Member Detail", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A").css("overflow-y", "auto");
					
					new SimpleEditor({
						id: "edit_member",
						dataset: params.dataset,
						container: tab.content,
						initData: function(editor, data) {
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								.setprops("certificate_no", {label:"Certificate No.", required:true})
								.setprops("full_name", {label:"Full Name", required:true})
								.setprops("dob", {label:"Date of Birth", type:"date", required:true})
								.setprops("gender", {label:"Gender"})
								.setprops("home_country_code", {label:"Home Country", upperCase:false, lookupDataset: desktop.dbCountries,
									getText: function(column, value) {
										return column.lookupDataset.lookup(value, "country");
									}
								)
								.setprops("nationality_code", {label:"Nationality"})

								.setprops("policy_no", {label:"Policy No.", readonly:true, readonly:true})
								.setprops("policy_holder", {label:"Policy Holder", readonly:true, readonly:true})
								.setprops("policy_issue_date", {label:"Issue/Purchase Date", type:"date", readonly:true})
								.setprops("policy_start_date", {label:"Effective Date", type:"date", readonly:true})
								.setprops("policy_end_date", {label:"Expiry Date", type:"date", readonly:true})

								.setprops("plan_code", {label:"Plan", readonly:true, required:true})
								.setprops("inception_date", {label:"Inception Date", readonly:true, type:"date"})
								.setprops("start_date", {label:"Effective Date", type:"date", readonly:true, required:true})
								.setprops("end_date", {label:"Expiry Date", type:"date", readonly:true, required:true})
								
								.setprops("client_name", {label:"Client", readonly:true})
								.setprops("product_name", {label:"Product", readonly:true})
								// .setprops("reference_no1", {label:"Reference 1"})
								// .setprops("reference_no2", {label:"Reference 2"})
								// .setprops("reference_no3", {label:"Reference 3"})
								
								.setprops("create_user", {label:"User", readonly:true})
								.setprops("create_date", {label:"Creation Date", type:"date", format:"datetime", readonly:true, 
									getText: function(column, value) {
										return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
									}})
								.setprops("update_user", {label:"User", readonly:true})
								.setprops("update_date", {label:"Update Date", type:"date", format:"datetime", readonly:true,
									getText: function(column, value) {
										return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("update_user"));
									}})
						},
						initEditor: function(editor) {
							editor.AddGroup("General", function(editor) {
								editor.AddEdit("certificate_no");
							});
							
							editor.AddGroup("Member's Personal Data", function(editor) {
								editor.AddEdit("full_name");
								editor.AddEdit("dob");
								editor.AddRadioButton("gender", {
									key: "id",
									value: "value",
									data: [
										{id:"F", value:"Female"},
										{id:"M", value:"Male"},
										{id:"", value:"N/A"}
									]
								});
								editor.AddLookup("home_country_code", {width:400, height:300, disableEdit:true, init:CountriesLookup});
								editor.AddEdit("nationality_code");
							});
								
							editor.AddGroup("Plan Information", function(editor) {
								editor.AddLink("plan_code", {link: function(dataColumn) {
									return __plan(dataColumn.dataset.get("plan_code"), true);
								}});
								editor.AddEdit("inception_date");
								editor.AddEdit("start_date");
								editor.AddEdit("end_date");
							});
								
							editor.AddGroup("Policy Information", function(editor) {
								editor.AddLink("policy_no", {link: function(dataColumn) {
									return __masterpolicy(dataColumn.dataset.get("policy_id"), true);
								}});
								editor.AddEdit("policy_holder");
							});
								
							editor.AddGroup("Policy Dates", function(editor) {
								editor.AddEdit("policy_issue_date");
								editor.AddEdit("policy_start_date");
								editor.AddEdit("policy_end_date");
							});
								
							editor.AddGroup("Client and Product", function(editor) {
								editor.AddLink("client_name", {link: function(dataColumn) {
									return __client(dataColumn.dataset.get("client_id"), true);
								}});
								editor.AddLink("product_name", {link: function(dataColumn) {
									return __product(dataColumn.dataset.get("product_code"), true);
								}});
							});
							
							editor.AddGroup("Update Info", function(editor) {
								editor.AddEdit("create_date");
								editor.AddEdit("update_date");
							});
						}
					});
				}
			});

			pg.NewTab("Plan History", {
				OnCreate: function(tab) {
					tab.content.css("border", "1px solid #92846A");
				}
			});
		}
	});
};

function MemberEdit2(params){
	return new FormEditor({
		id: params.id,
		dialog: params.dialog,
		container: params.container,
		containerPadding: defaultValue(params.containerPadding, 10),
		containerPadding: defaultValue(params.containerPadding, 10),
		pageControlTheme: defaultValue(params.pageControlTheme, "main"),
		fillContainer: defaultValue(params.fillContainer, false),
		showToolbar: params.showToolbar,
		// showToolbar: true,
		url: params.url,
		postBack: "member",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
				data.Columns
					.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
					.setprops("certificate_no", {label:"Certificate No.", required:true})
					.setprops("full_name", {label:"Full Name", required:true})
					.setprops("dob", {label:"Date of Birth", type:"date", required:true})
					.setprops("gender", {label:"Gender"})
					.setprops("home_country_code", {label:"Home Country"})
					.setprops("nationality_code", {label:"Nationality"})

					.setprops("policy_no", {label:"Policy No.", readonly:true, readonly:true})
					.setprops("policy_holder", {label:"Policy Holder", readonly:true, readonly:true})
					.setprops("policy_issue_date", {label:"Issue/Purchase Date", type:"date", readonly:true})
					.setprops("policy_start_date", {label:"Effective Date", type:"date", readonly:true})
					.setprops("policy_end_date", {label:"Expiry Date", type:"date", readonly:true})

					.setprops("plan_code", {label:"Plan", required:true})
					.setprops("inception_date", {label:"Inception Date", type:"date"})
					.setprops("start_date", {label:"Effective Date", type:"date", required:true})
					.setprops("end_date", {label:"Expiry Date", type:"date", required:true})
					
					.setprops("client_name", {label:"Client", readonly:true})
					.setprops("product_name", {label:"Product", readonly:true})
					// .setprops("reference_no1", {label:"Reference 1"})
					// .setprops("reference_no2", {label:"Reference 2"})
					// .setprops("reference_no3", {label:"Reference 3"})
					
					// .setprops("status", {label:"Status"})
					// .setprops("expired", {label:"Expired"})
					
					.setprops("create_user", {label:"User", readonly:true})
					.setprops("create_date", {label:"Creation Date", type:"date", format:"datetime", readonly:true, 
						getText: function(column, value) {
							return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
						}})
					.setprops("update_user", {label:"User", readonly:true})
					.setprops("update_date", {label:"Update Date", type:"date", format:"datetime", readonly:true,
						getText: function(column, value) {
							return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("update_user"));
						}})
					
					// .setprops("country_of_incident", {label:"Country of Incident", required:true})

					// .setprops("is_prexisting", {label:"Pre-Existing"})
					// .setprops("is_accident", {label:"Accident"})
					// .setprops("first_symptom_date", {label:"First Symptom", type:"date", required:true})
					// .setprops("first_consultation_date", {label:"First Consultation", type:"date", required:true})
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {

				editor.NewGroupEdit("Member Detail", function(editor, tab) {
					editor.AddGroup("General", function(editor) {
						// editor.AddEdit("id");
						editor.AddEdit("certificate_no");
						// editor.AddEdit("claim_type");
						// editor.AddEdit("case_owner");
						// editor.AddEdit("status");
						// editor.AddEdit("notification_date");
					});
						
					editor.AddGroup("Member's Personal Data", function(editor) {
						editor.AddEdit("full_name");
						editor.AddEdit("dob");
						editor.AddRadioButton("gender", {
							key: "id",
							value: "value",
							data: [
								{id:"F", value:"Female"},
								{id:"M", value:"Male"},
								{id:"", value:"N/A"}
							]
						});
						editor.AddEdit("home_country_code");
						editor.AddEdit("nationality_code");
					});
						
					editor.AddGroup("Plan Information", function(editor) {
						editor.AddEdit("plan_code");
						editor.AddEdit("inception_date");
						editor.AddEdit("start_date");
						editor.AddEdit("end_date");
					});
						
					editor.AddGroup("Policy Information", function(editor) {
						editor.AddEdit("policy_no");
						editor.AddEdit("policy_holder");
					});
						
					editor.AddGroup("Policy Dates", function(editor) {
						editor.AddEdit("policy_issue_date");
						editor.AddEdit("policy_start_date");
						editor.AddEdit("policy_end_date");
					});
						
					editor.AddGroup("Client and Product", function(editor) {
						editor.AddEdit("client_name");
						editor.AddEdit("product_name");
					});
					
					editor.AddGroup("Update Info", function(editor) {
						editor.AddEdit("create_date");
						editor.AddEdit("update_date");
					});
					
					// editor.AddGroup("Creation", function(editor) {
						// editor.AddEdit("create_date");
						// editor.AddEdit("create_user");
					// });
					
					// editor.AddGroup("Last Update", function(editor) {
						// editor.AddEdit("update_date");
						// editor.AddEdit("update_user");
					// });
				});
				
				editor.NewContainer("Addresses", function(editor, container) {
				});
				
				editor.NewContainer("Contacts", function(editor, container) {
				});
				
				// editor.NewContainer("Medical Notes", function(editor, container) {
				// });
				
				// editor.NewContainer("Underwriting Notes", function(editor, container) {
				// });
			});
		}
	});
}; 
