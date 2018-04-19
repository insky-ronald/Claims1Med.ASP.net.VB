// ****************************************************************************************************
// File name: edit-product.js
// Last modified on
// 
// ****************************************************************************************************
function ProductEdit(params) {
	params.container.addClass("product");
	params.dataset = new Dataset(desktop.customData.data, "Product");
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
					pg.NewTab("Product", {
						OnCreate: function(tab) {
							tab.content.css("border", "1px solid #92846A");
							new SimpleEditor({
								id: "edit_product",
								dataset: params.dataset,
								container: tab.content,
								initData: function(editor, data) {
									data.Columns
										.setprops("code", {label:"Code", numeric:false, key: true, required:true, maxLength:10, upperCase:true})
										.setprops("product_name", {label:"Name", required:true})
										.setprops("client_id", {label:"Client", numeric:true, required:true, readonly:true})
										.setprops("client_name", {label:"Client", required:true})
										.setprops("float_id", {label:"Default Float", numeric:true, required:true, readonly:true, 
											getText: function(column, value) {
												return column.dataset.get("float_name");
											}})
										.setprops("float_name", {label:"Float", required:true})
										.setprops("claim_reference_name1", {label:"Reference No. 1"})
										.setprops("claim_reference_name2", {label:"Reference No. 2"})
										.setprops("claim_reference_name3", {label:"Reference No. 3"})
										.setprops("member_reference_name1", {label:"Reference No. 1"})
										.setprops("member_reference_name2", {label:"Reference No. 2"})
										.setprops("member_reference_name3", {label:"Reference No. 3"})
										
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
										editor.AddEdit("product_name");
									});
									editor.AddGroup("Client and Float", function(editor) {
										editor.AddLink("client_name", {link: function(dataColumn) {
											return __client(dataColumn.dataset.get("client_id"), true);
										}});
										editor.AddEdit("float_id");
									});
									editor.AddGroup("Claim Reference Numbers", function(editor) {
										editor.AddEdit("claim_reference_name1");
										editor.AddEdit("claim_reference_name2");
										editor.AddEdit("claim_reference_name3");
									});
									editor.AddGroup("Member Reference Numbers", function(editor) {
										editor.AddEdit("member_reference_name1");
										editor.AddEdit("member_reference_name2");
										editor.AddEdit("member_reference_name3");
									});
									editor.AddGroup("Time stamp", function(editor) {
										editor.AddEdit("create_date");
										editor.AddEdit("update_date");
									});
								}
							});
						}
					});

					// pg.NewTab("Plan History", {
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
