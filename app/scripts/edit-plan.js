// ****************************************************************************************************
// File name: edit-plan.js
// Last modified on
// 
// ****************************************************************************************************
function PlanEdit(params) {
	params.container.addClass("plan");
	params.dataset = new Dataset(desktop.customData.data, "Plan");
	var product_code = params.requestParams.product_code;

	return new CustomEditView(params, function(view) { // CustomEditView: refer to engine/edit-custom-view.js
		view.Events.OnInitContent.add(function(view, container) {
			new JPageControl({
				owner: this,
				container: container,
				Painter: {
					theme: "main",
					autoHeight: false
				},
				init: function(pg) {
					pg.NewTab("Plan", {
						OnCreate: function(tab) {
							tab.content.css("border", "1px solid #92846A");
							new SimpleEditor({
								id: "edit_product",
								dataset: params.dataset,
								container: tab.content,
								initData: function(editor, data) {
									data.Columns
										.setprops("code", {label:"Code", numeric:false, key: true, required:true, maxLength:15, upperCase:true})
										.setprops("plan_name", {label:"Name", required:true})
										.setprops("plan_type", {label:"Plan Type", required:false})
										.setprops("currency_code", {label:"Currency", required:true, maxLength:3, upperCase:true})
										.setprops("client_name", {label:"Client", required:false, readonly:true})
										.setprops("product_name", {label:"Product", required:false, readonly:true})
										.setprops("create_user", {label:"User", readonly:true})
										.setprops("create_date", {label:"Created on", type:"date", format:"datetime", readonly:true, 
											getText: function(column, value) {
												return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("create_user"));
											}})
										.setprops("update_user", {label:"User", readonly:true})
										.setprops("update_date", {label:"Last update on", type:"date", format:"datetime", readonly:true,
											getText: function(column, value) {
												return ("{0} by {1}").format(column.formatDateTime(), column.dataset.get("update_user"));
											}})
								},
								initEditor: function(editor) {
									editor.AddGroup("General", function(editor) {
										editor.AddEdit("code");
										editor.AddEdit("plan_name");
										editor.AddEdit("currency_code");
									});
									editor.AddGroup("Client and Product", function(editor) {
										editor.AddLink("client_name", {link: function(dataColumn) {
											return __client(dataColumn.dataset.get("client_id"), true);
										}});
										editor.AddLink("product_name", {link: function(dataColumn) {
											return __product(dataColumn.dataset.get("product_code"), true);
										}});
									});
									editor.AddGroup("Options", function(editor) {
										editor.AddEdit("plan_type");
									});
									// editor.AddGroup("Claim Reference Numbers", function(editor) {
										// editor.AddEdit("claim_reference_name1");
										// editor.AddEdit("claim_reference_name2");
										// editor.AddEdit("claim_reference_name3");
									// });
									// editor.AddGroup("Member Reference Numbers", function(editor) {
										// editor.AddEdit("member_reference_name1");
										// editor.AddEdit("member_reference_name2");
										// editor.AddEdit("member_reference_name3");
									// });
									editor.AddGroup("Time stamp", function(editor) {
										editor.AddEdit("create_date");
										editor.AddEdit("update_date");
									});
								}
							});
						}
					});

					// pg.NewTab("Discharge Summary", {
						// OnCreate: function(tab) {
							// tab.content.css("border", "1px solid #92846A");
						// }
					// });
				}
			});
		});
		
		// view.Events.OnInitToolbar.add(function(view, toolbar) {
		// });
	});
};
