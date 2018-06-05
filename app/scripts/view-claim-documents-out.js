// ****************************************************************************************************
// Last modified on
// 10:55 AM Saturday, June 2, 2018
// ****************************************************************************************************
//==================================================================================================
// File name: view-claim-documents-out.js
//==================================================================================================
function ClaimDocumentsOutView(viewParams){
	// console.log(viewParams)
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "claim-documents",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				// console.log("OK")
				grid.optionsData.url = "app/claim-documents";
				
				// grid.options.viewType = "cardview";
				// grid.options.hideHeader = true;
				grid.options.horzScroll = true;
				grid.options.allowSort = false;
				grid.options.editNewPage = false;
				grid.options.showBand = true;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("claim_id", viewParams.requestParams.claim_id, {numeric:true})
						.addColumn("service_id", viewParams.requestParams.service_id, {numeric:true})
						.addColumn("document_source", "O")
						.addColumn("sort", "reference_no")
						.addColumn("order", "asc")
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("x-status", grid.dataset.get("action_code").toLowerCase())
				});	
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("service_name", {label:"Type"})
						.setprops("reference_no", {label:"Reference No."})
						.setprops("document_name", {label:"Document Name"})
						.setprops("status", {label:"Status"})
						.setprops("source_name", {label:"Source"})
						.setprops("document_categories", {label:"Categories"})
						.setprops("recipient", {label:"Sender"})
						.setprops("email", {label:"Email"})
						.setprops("phone_no", {label:"Contact No."})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						.setprops("create_user_name", {label:"Created By"})
						.setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						.setprops("update_user_name", {label:"Updated By"})
						.setprops("document_date_received", {label:"Date Received", type:"date", format:"datetime"})
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
					if(!viewParams.requestParams.service_id) {
						grid.NewBand({caption:"Service"}, function(band) {
							band.NewColumn({fname: "service_name", width: 150, allowSort: true, fixedWidth:true});
							band.NewColumn({fname: "reference_no", width: 150, allowSort: true, fixedWidth:true});
						});
					};
					
					grid.NewBand({caption:"Document"}, function(band) {
						band.NewColumn({fname: "document_name", width: 250, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "document_date_received", width: 150, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "source_name", width: 150, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "status", width: 150, allowSort: true, fixedWidth:true});
					});
					
					// grid.NewBand({caption:"Sender"}, function(band) {
						// band.NewColumn({fname: "recipient", width: 150, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "email", width: 150, allowSort: true, fixedWidth:true});
						// band.NewColumn({fname: "phone_no", width: 150, allowSort: true, fixedWidth:true});
					// });
					
					grid.NewBand({caption:"Update Log"}, function(band) {
						band.NewColumn({fname: "create_date", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "create_user_name", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "update_date", width: 150, allowSort: true, fixedWidth:true});
						band.NewColumn({fname: "update_user_name", width: 150, allowSort: true, fixedWidth:true});
					});
					
					// grid.NewBand({caption:"", fixed:"right"}, function(band) {
						// band.NewColumn({fname: "document_categories", width: 200, allowSort: true, fixedWidth:true});
					// })
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
					// owner.initStatusToolbar(toolbar);
				});
			});
		}
	}));
};
