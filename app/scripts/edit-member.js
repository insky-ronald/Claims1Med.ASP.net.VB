// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: edit-member.js
//==================================================================================================
function MemberEdit(viewParams){	
	return new JFormEditor({
		id: viewParams.id,
		dataset: desktop.dbMember,
		mode: desktop.dbMember.get("id") ? "edit": "new",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		url: "?id=" + desktop.dbMember.get("id"),
		// postBack: "app/claim-details",
		postBack: "app/member",
		init: function(editor) {
			editor.Events.OnInitData.add(function(group, columnName) {
				// console.log(columnName)
			});
			
			editor.Events.OnPostSuccess2.add(function(editor, returnData) {
				if (returnData.mode == "new" && returnData.result.id) {
					location.href = __member(returnData.result.id, true);
				}
			});

			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"General", icon:{name:"view-list", color:"forestgreen"}},
					function(editor, tab) {
						editor.group.OnDatasetChanged.add(function(group, columnName) {
						});
						
						editor.AddGroup("General", function(editor) {
							editor.AddEdit({ID: "certificate_no"});
						});
						
						editor.AddGroup("Member's Personal Data", function(editor) {
							editor.AddEdit({ID: "first_name"});
							editor.AddEdit({ID: "middle_name"});
							editor.AddEdit({ID: "last_name"});
							editor.AddEdit({ID: "dob"});
							editor.AddRadioButton("gender", {
								key: "id",
								value: "value",
								data: [
									{id:"M", value:"Male"},
									{id:"F", value:"Female"},
									{id:"", value:"N/A"}
								]
							});
							editor.AddLookup("home_country_code", {width:400, height:300, disableEdit:true, init:CountriesLookup});
						});
						
						editor.AddGroup("Custom Reference Numbers", function(editor) {
							if (desktop.dbProduct.get("member_reference_name1")) {
								editor.AddEdit({ID: "reference_no1"});
							}
							if (desktop.dbProduct.get("member_reference_name2")) {
								editor.AddEdit({ID: "reference_no2"});
							}
							if (desktop.dbProduct.get("member_reference_name3")) {
								editor.AddEdit({ID: "reference_no3"});
							}
						});
						
						editor.AddGroup("Plan Information", function(editor) {
							// editor.AddEdit({ID: "plan_code"});
							editor.AddLink({ID: "plan_code", link: function(column) {
								return __plan(column.dataset.get("plan_code"), true);
							}});
							editor.AddEdit({ID: "inception_date"});
							editor.AddEdit({ID: "start_date"});
							editor.AddEdit({ID: "end_date"});
						});
						
						editor.AddGroup("Policy Information", function(editor) {
							editor.AddEdit({ID: "policy_no"});
							editor.AddEdit({ID: "policy_holder"});
							editor.AddEdit({ID: "policy_issue_date"});
							editor.AddEdit({ID: "policy_start_date"});
							editor.AddEdit({ID: "policy_end_date"});
						});
						
						editor.AddGroup("Product and Client", function(editor) {
							// editor.AddEdit({ID: "product_code"});
							editor.AddLink({ID: "product_name", link: function(column) {
								return __product(column.dataset.get("product_code"), true);
							}});
							editor.AddLink({ID: "client_name", link: function(column) {
								return __client(column.dataset.get("client_id"), true);
							}});
						});
				)
			});
		}
	});
}; 
