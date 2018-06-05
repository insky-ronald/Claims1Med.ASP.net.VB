// ****************************************************************************************************
// Last modified on
// 10:23 PM Friday, October 6, 2017
// ****************************************************************************************************
//==================================================================================================
// File name: view-documents.js
//==================================================================================================
function DocumentsView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "documents",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/documents";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = true;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = false;//true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("filter", "")
						.addColumn("sort", "id")
						.addColumn("order", "desc")
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("action_code").toLowerCase())
				});	
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("file_name", {label:"File Name"})
						.setprops("file_extension", {label:"File Extension"})
						.setprops("type_id", {label:"Type"})
						.setprops("size", {label:"Size"})
						// .setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						// .setprops("create_user_name", {label:"Created By"})
						// .setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						// .setprops("update_user_name", {label:"Updated By"})
				});
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "master-detail") {
						return "notes"
					} else {
						return defaultValue
					}
				});
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "master-detail") {
						return "View note"
					} else if(column.command === "delete") {
						return "Delete document"
					} else {
						return defaultValue
					}
				});
				
				grid.Events.OnInitColumns.add(function(grid) {				
					grid.NewColumn({fname: "id", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "file_name", width: 300, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "file_extension", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "type_id", width: 100, allowSort: true, fixedWidth:true});
					grid.NewColumn({fname: "size", width: 100, allowSort: true, fixedWidth:true});
				});
				
				grid.Events.OnInitCard.add(function(grid, card) {
					grid.dataset.gotoKey(parseInt(card.attr("row-id")));
					// card.attr("x-status", grid.dataset.raw("is_done"));
					
					CreateElementEx("div", card, function(container) {						
						CreateElementEx("div", container, function(container) {
							// CreateElement("span", container).addClass("type").html(grid.dataset.text("reference_no"))
							// CreateElement("span", container).addClass("sub-type").html(grid.dataset.text("action"))
						}, "title")
					}, "document");
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(175);
					// params.setHeight("auto");
					CreateElementEx("pre", params.container, function(notes) {
						notes.append(grid.dataset.text("notes"));
					});
					// ListNoteSubTypes({
						// noteSubType: grid.dataset.get("code"),
						// container: params.container
					// })
				})
				
				grid.Events.OnInitToolbar.add(function(grid, toolbar) {
					toolbar.NewDropDownUpload({
						id: "upload",
						icon: "upload",
						color: "dodgerblue",
						hint: "Upload Files",
						title: "Upload Files",
						width: 600,
						height: 300,
						// dataBind: desktop.dbClaim,
						// dataEvent: function(dataset, button) {
							// button.show(!dataset.editing);
						// },
						// permission: {view:desktop.customData.crud["delete"]},
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
				});
			});
		}
	}));
};
