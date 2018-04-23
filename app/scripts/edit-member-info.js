// ****************************************************************************************************
// File name: edit-member-info.js
// Last modified on
// 26-SEP-2017
// ****************************************************************************************************
function MemberInfoView(viewParams) {
	return new JFormEditor({
		id: viewParams.id,
		dataset: desktop.dbMember,
		mode: "edit",
		container: viewParams.container,
		containerPadding: 10,
		pageControlTheme: "main",
		fillContainer: false,
		showToolbar: false,
		url: "?id=" + desktop.dbMember.get("member_id"),
		postBack: "app/member-info",
		init: function(editor) {
			editor.Events.OnInitData.add(function(sender, data) {
			});
			
			editor.Events.OnInitEditor.add(function(sender, editor) {
				editor.NewGroupEdit({caption:"General", icon:{name:"view-list", color:"forestgreen"}}, 
					function(editor, tab) {
						editor.AddGroup("Member Information", function(editor) {
							editor.AddEdit({ID: "certificate_no"});
							editor.AddEdit({ID: "main_member"});
							editor.AddLink({ID: "member_name", link: function(column) {
								return __member(column.dataset.get("member_id"), true);
							}});
							editor.AddEdit({ID: "dob"});
							editor.AddEdit({ID: "sex"});
							editor.AddEdit({ID: "age"});
							// editor.AddRadioButton("is_vip", {
								// key: "id",
								// value: "value",
								// data: [
									// {id:1, value:"Yes"},
									// {id:0, value:"No"}
								// ]
							// });
							// editor.AddRadioButton("is_blacklist", {
								// key: "id",
								// value: "value",
								// data: [
									// {id:1, value:"Yes"},
									// {id:0, value:"No"}
								// ]
							// });
						});
						
						editor.AddGroup("Policy Information", function(editor) {
							editor.AddEdit({ID: "policy_no"});
							editor.AddEdit({ID: "policy_holder"});
							editor.AddLink({ID: "client_name", link: function(column) {
								return __client(column.dataset.get("client_id"), true);
							}});
							editor.AddLink({ID: "product_name", link: function(column) {
								return __product(column.dataset.get("product_code"), true);
							}});
							// editor.AddEdit({ID: "product_name"});
							editor.AddEdit({ID: "policy_issue_date"});
							editor.AddEdit({ID: "policy_start_date"});
							editor.AddEdit({ID: "policy_end_date"});
						});
						
						editor.AddGroup("Plan Information", function(editor) {
							// editor.AddEdit({ID: "plan_code"});
							editor.AddLink({ID: "plan_code", link: function(column) {
								return __plan(column.dataset.get("plan_code"), true);
							}});
							editor.AddEdit({ID: "sub_product"});
						});
					}
				);
			});
		}
	});
};
