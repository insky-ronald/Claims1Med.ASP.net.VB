// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-member.js
// CustomerServiceEdit is called from customer-service.js
//==================================================================================================
function CustomerServiceEdit(params) {
	new jPageControl({
		paintParams: {
			theme: "customer-service-search",
			icon: {
				size: 18,
				position: "left",
				// name: "settings",
				// color: "#27AE60"
			}
		},
		container: params.container,
		init: function(pg) {
			pg.addTab({caption:"Call Detail",
				OnCreate: function(tab) {
					new SimpleEditor({
						id: "edit_member",
						dataset: params.dataset, // refer to customer-service.js, params.dataset
						container: tab.container,
						initData: function(editor, data) {
							data.Columns
								.setprops("id", {label:"ID", numeric:true, key: true, readonly:true})
								.setprops("customer_service_no", {label:"Reference No."})
								.setprops("customer_service_type", {label:"Call Type", required:true})
								
								.setprops("caller_first_name", {label:"First Name"})
								.setprops("caller_middle_name", {label:"Middle Name"})
								.setprops("caller_last_name", {label:"Last Name"})
								.setprops("caller_full_name", {label:"Full Name", 
									onChange: function(column) {
										// console.log(column)
										column.dataset.set("full_name", column.get());
									}
								})
								.setprops("caller_title", {label:"Title"})
								.setprops("caller_relationship", {label:"Relationship"})
								
								.setprops("caller_phone_no", {label:"Phone No."})
								.setprops("caller_mobile_no", {label:"Mobile No."})
								.setprops("caller_fax_no", {label:"Fax No."})
								.setprops("caller_email", {label:"E-mail"})
								
								.setprops("caller_country_code", {label:"Country"})
								.setprops("caller_town", {label:"Town"})
								.setprops("caller_place", {label:"Place"})

								.setprops("first_name", {label:"First Name"})
								.setprops("middle_name", {label:"Middle Name"})
								.setprops("last_name", {label:"Last Name"})
								.setprops("full_name", {label:"Member's Name", readonly:true})
								.setprops("sex", {label:"Gender"})
								.setprops("dob", {label:"Date of Birth"})
								.setprops("home_country_code", {label:"Home Country"})
								.setprops("nationality_code", {label:"Nationality"})
								.setprops("reference_no1", {label:"Reference No. #1"})
								.setprops("reference_no2", {label:"Reference No. #2"})
								.setprops("reference_no3", {label:"Reference No. #3"})
								
						},
						initEditor: function(editor) {
							editor.AddGroup("General", function(editor) {
								editor.AddEdit("customer_service_no");
								editor.AddEdit("customer_service_type");
							});
							editor.AddGroup("Caller's Information", function(editor) {
								editor.AddEdit("caller_full_name");
								editor.AddEdit("caller_title");
								editor.AddEdit("caller_relationship");
							});
							editor.AddGroup("Caller's Contact Numbers", function(editor) {
								editor.AddEdit("caller_phone_no");
								editor.AddEdit("caller_mobile_no");
								editor.AddEdit("caller_fax_no");
								editor.AddEdit("caller_email");
							});
							editor.AddGroup("Caller's Location", function(editor) {
								editor.AddEdit("caller_country_code");
								editor.AddEdit("caller_town");
								editor.AddEdit("caller_place");
							});
							editor.AddGroup("Members's Information", function(editor) {
								editor.AddEdit("full_name");
								editor.AddEdit("sex");
								editor.AddEdit("dob");
								editor.AddEdit("home_country_code");
								editor.AddEdit("nationality_code");
								editor.AddEdit("reference_no1");
								editor.AddEdit("reference_no2");
								editor.AddEdit("reference_no3");
							});
						}
					});
				}
			});
			pg.addTab({caption:"Policy & Plan",
				OnCreate: function(tab) {
					new SimpleEditor({
						id: "edit_member",
						dataset: params.dataset, // refer to customer-service.js, params.dataset
						container: tab.container,
						initData: function(editor, data) {
							data.Columns
								.setprops("certificate_no", {label:"Certificate No."})
								.setprops("plan_code", {label:"Plan"})
								.setprops("effective_date", {label:"Effective Date"})
								.setprops("expiry_date", {label:"Expiry Date"})
								.setprops("client_id", {label:"Client", numeric:true})
								.setprops("client_name", {label:"Client"})
								.setprops("policy_no", {label:"Policy No."})
								.setprops("policy_holder", {label:"Policy Holder"})
								.setprops("product_code", {label:"Product"})
								.setprops("product_name", {label:"Product"})
								.setprops("policy_issue_date", {label:"Issue/Purchase Date"})
								.setprops("policy_effective_date", {label:"Effective Date"})
								.setprops("policy_expiry_date", {label:"Expiry Date"})
						},
						initEditor: function(editor) {
							editor.AddGroup("Member's Plan Information", function(editor) {
								editor.AddEdit("certificate_no");
								editor.AddEdit("plan_code");
								editor.AddEdit("effective_date");
								editor.AddEdit("expiry_date");
							});
							
							editor.AddGroup("Member's Policy Information", function(editor) {
								editor.AddEdit("client_id");
								editor.AddEdit("policy_no");
								editor.AddEdit("policy_holder");
								editor.AddEdit("product_code");
								editor.AddEdit("policy_issue_date");
								editor.AddEdit("policy_effective_date");
								editor.AddEdit("policy_expiry_date");
							});
						}
					});
				}
			});
			pg.addTab({caption:"Claim",
				OnCreate: function(tab) {
					new SimpleEditor({
						id: "edit_member",
						dataset: params.dataset, // refer to customer-service.js, params.dataset
						container: tab.container,
						initData: function(editor, data) {
							data.Columns
								.setprops("claim_no", {label:"Claim No."})
								.setprops("hcm_reference_no", {label:"HCM Reference"})
								.setprops("claim_type", {label:"Type"})
								.setprops("case_owner", {label:"Owner"})
								.setprops("status_code", {label:"Status"})
								.setprops("claim_create_date", {label:"Date Created"})
								.setprops("claim_update_date", {label:"Date Updated"})
								
								.setprops("service_no", {label:"Reference No."})
								.setprops("service_type", {label:"Type"})
								.setprops("service_sub_type", {label:"Sub-Type"})
								.setprops("service_create_date", {label:"Date Created"})
								.setprops("service_update_date", {label:"Date Updated"})
								
								.setprops("service_status_code", {label:"Status"})
								.setprops("service_sub_status_code", {label:"Sub-Status"})
								
								.setprops("provider_id", {label:"Hospital"})
								.setprops("doctor_id", {label:"Doctor"})
								
								.setprops("invoice_no", {label:"Invoice No."})
								.setprops("invoice_received_date", {label:"Received Date"})
								.setprops("service_date", {label:"Incident Date"})
						},
						initEditor: function(editor) {
							editor.AddGroup("Claim", function(editor) {
								editor.AddEdit("claim_no");
								editor.AddEdit("hcm_reference_no");
								editor.AddEdit("case_owner");
								editor.AddEdit("status_code");
								editor.AddEdit("claim_create_date");
								editor.AddEdit("claim_update_date");
							});
							
							editor.AddGroup("Service", function(editor) {
								editor.AddEdit("service_no");
								editor.AddEdit("service_type");
								editor.AddEdit("service_sub_type");
								editor.AddEdit("service_create_date");
								editor.AddEdit("service_update_date");
							});
							
							editor.AddGroup("Service Status", function(editor) {
								editor.AddEdit("service_status_code");
								editor.AddEdit("service_sub_status_code");
							});
							
							editor.AddGroup("Provider", function(editor) {
								editor.AddEdit("provider_id");
								editor.AddEdit("doctor_id");
							});
							
							editor.AddGroup("Invoice", function(editor) {
								editor.AddEdit("invoice_no");
								editor.AddEdit("invoice_received_date");
								editor.AddEdit("service_date");
							});
						}
					});
				}
			});
		}
	});
};
