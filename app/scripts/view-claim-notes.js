// ****************************************************************************************************
// Last modified on
// 11:55 PM Wednesday, October 4, 2017
// ****************************************************************************************************
// File name: view-claim-notes.js
// ****************************************************************************************************
function ClaimNotesView(viewParams){
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "notes",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			CountriesEdit({
				code: id,
				container: container,
				dialog: dialog
			})
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/claim-notes";
				
				grid.options.horzScroll = true;
				grid.options.allowSort = true;
				grid.options.editNewPage = false;
				grid.options.showBand = false;
				grid.options.showSummary = false;
				grid.options.showPager = false;
				grid.options.showMasterDetail = true;
				
				grid.search.visible = false;
				grid.exportData.allow = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("type", viewParams.requestParams.type)
						.addColumn("claim_id", viewParams.requestParams.claim_id, {numeric:true})
						.addColumn("service_id", viewParams.requestParams.service_id, {numeric:true})
						// .addColumn("sort", viewParams.requestParams.type == "C" ? "reference_no" : "category")
						.addColumn("sort", "create_date")
						.addColumn("order", "desc")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("is_new", {numeric:true})
						.setprops("is_deleted", {numeric:true})
						.setprops("claim_id", {numeric:true})
						.setprops("service_id", {numeric:true})
						// .setprops("module_id", {label:"Module"})
						.setprops("reference_no", {label:"Service No."})
						// .setprops("code", {label:"Code"})
						.setprops("note_type_name", {label:"Category"})
						.setprops("note_sub_type_name", {label:"Sub-Category"})
						// .setprops("sub_status", {label:"Sub-Status"})
						.setprops("create_user_name", {label:"Created By"})
						.setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						// .setprops("updated_user_name", {label:"User"})
						// .setprops("updated_at", {label:"Date", type:"date", format:"datetime"})
						.setprops("notes", {
							getText: function(column, value) {
								// return value.replace(/\n/g, "<br>").replace(/\t/g, "&emsp;");
								// return value.replace(/\n/g, "<br>").replace(/\t/g, "&#9;");
								return value;
							}
						})
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					row.attr("service-status", grid.dataset.get("status_code").toLowerCase())
				});	
		
				grid.methods.add("getCommandHeaderIcon", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "notes"
					else
						return defaultValue
				})
		
				grid.methods.add("getCommandHint", function(grid, column, defaultValue) {
					if(column.command === "master-detail")
						return "View note"
					else if(column.command === "delete")
						return "Delete note"
					else
						return defaultValue
				})
		
				grid.methods.add("allowCommand", function(grid, column, defaultValue) {
					if(column.command === "edit")
						return grid.dataset.get("is_new")
					else
						return true
				})
				
				grid.Events.OnInitColumns.add(function(grid) {
					if(viewParams.requestParams.type == "C") {
						grid.NewColumn({fname: "reference_no", width: 150});
					}
					
					grid.NewColumn({fname: "note_type_name", width: 150});
					grid.NewColumn({fname: "note_sub_type_name", width: 200});
					grid.NewColumn({fname: "create_date", width: 150});
					grid.NewColumn({fname: "create_user_name", width: 125});
				});

				grid.Events.OnMasterDetail.add(function(grid, params) {
					params.setHeight(250);
					CreateElementEx("pre", params.container, function(notes) {
						notes.append(grid.dataset.text("notes"));
					});
					// ListNoteSubTypes({
						// noteSubType: grid.dataset.get("code"),
						// container: params.container
					// })
				})
				
			});
		}
	}));
};
