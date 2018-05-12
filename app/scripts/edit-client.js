// ****************************************************************************************************
// File name: edit-client.js
// Last modified on
// 
// ****************************************************************************************************
function ClientEdit(params) {
	params.container.addClass("client");
	params.dataset = new Dataset(desktop.customData.data, "Client");
	var client_id = params.requestParams.client_id;

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
					pg.NewTab("Client", {
						OnCreate: function(tab) {
							tab.content.css("border", "1px solid #92846A");
							new SimpleEditor({
								id: "edit_product",
								dataset: params.dataset,
								container: tab.content,
								initData: function(editor, data) {
									data.Columns
										.setprops("id", {label:"ID", numeric:true, key: true})
										.setprops("full_name", {label:"Name", required:true})
										.setprops("currency_code", {label:"Currency", required:true, maxLength:3, upperCase:true})
										.setprops("status_code", {label:"Active", required:false})
										.setprops("sun_code", {label:"Sun Code", required:false})
										.setprops("soa_prefix", {label:"SOA Prefix", required:false})
										.setprops("prefix_code", {label:"Prefix Code", required:false})
										.setprops("large_loss_amount", {label:"Amount", required:false, type:"money", format:"00"})
										.setprops("hotline", {label:"Numbers", required:false})
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
										editor.AddEdit("full_name");
										// editor.AddEdit("plan_name");
										editor.AddEdit("currency_code");
										editor.AddRadioButton("status_code", {
											key: "id",
											value: "value",
											data: [
												{id:"A", value:"Yes"},
												{id:"X", value:"No"}
											]
										});
									});
									editor.AddGroup("Reference Numbers", function(editor) {
										editor.AddEdit("sun_code");
										editor.AddEdit("soa_prefix");
										editor.AddEdit("prefix_code");
									});
									editor.AddGroup("Large Loss Limit", function(editor) {
										editor.AddEdit("large_loss_amount");
									});
									editor.AddGroup("Hotline Numbers", function(editor) {
										editor.AddEdit("hotline");
									});
									editor.AddGroup("Time stamp", function(editor) {
										editor.AddEdit("create_date");
										editor.AddEdit("update_date");
									});
								}
							});
						}
					});

					pg.NewTab("Pre-Approved Diagnosis", {
						OnCreate: function(tab) {
							tab.content.css("border", "1px solid #92846A");
						}
					});
				}
			});
		});
		
		
		view.Events.OnInitToolbar.add(function(view, toolbar) {
			console.log(view); return;
			toolbar.NewDropDownConfirmItem({
				id: "delete",
				icon: "delete",
				color: "firebrick",
				hint: "Delete claim",
				title: "Delete Claim",
				subTitle: "Please confirm to delete claim.",
				// dataBind: view.dataset,
				dataBind: params.dataset,
				dataEvent: function(dataset, button) {
					button.show(!dataset.editing);
				},
				confirm: function(button) {
					// desktop.Ajax(null, "/app/get/delete/claim", {
							// mode: "delete",
							// data: "["+JSON.stringify({id: desktop.dbClaim.get("id")})+"]"
						// }, 
						// function(result) {
							// if(result.status < 0) {
								// ErrorDialog({
									// target: button.elementContainer,
									// title: "Error deleting claim",
									// message: result.message,
									// snap: "bottom",
									// inset: false
								// })
							// } else {
								// window.close();
							// }
						// }
					// )
				}
			});
			
			toolbar.SetVisible("delete", !desktop.dbClaim.editing);
		});
	});
};
