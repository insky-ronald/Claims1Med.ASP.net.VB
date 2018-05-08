// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-diagnosis.js
//==================================================================================================
function DiagnosisView(viewParams){
	// var name = "app/clinics";
	
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "clinics",
			toolbar: {theme: "svg"}
		},
		editForm: function(id, container, dialog) {
			// ClinicEdit({
				// id: id,
				// container: container,
				// dialog: dialog
			// })
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/diagnosis";
				// grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				// grid.search.mode = "advanced";
				grid.search.mode = "mixed";
				grid.search.columnName = "filter";
				grid.search.searchWidth = 350;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						.addColumn("version", "10")
						.addColumn("is_shortlist", 1, {numeric:true})
			
					dataParams.Columns
						.setprops("filter", {label:"Diagnosis"})
						.setprops("is_shortlist", {label:"Condensed list"})
						.setprops("version", {label:"Version"})
						
					dataParams.Events.OnResetSearch.add(function(dataset) {
						dataset.set("is_shortlist", 1);
						dataset.set("version", "10");
					});
				});
				
				grid.Events.OnInitSearch.add(function(grid, editor) {
					editor.Events.OnInitEditor.add(function(sender, editor) {
						editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
							tab.container.css("border", "1px silver");
							tab.container.css("border-style", "solid solid none solid");

							// editor.AddGroup("Find Diagnosis", function(editor) {
							editor.AddGroup("Advanced Search", function(editor) {
								// editor.AddEdit("filter");
								editor.AddRadioButton("is_shortlist", {
									key: "id",
									value: "value",
									data: [
										{id:1, value:"Yes"},
										{id:0, value:"No"}
									]
								});
								editor.AddRadioButton("version", {
									key: "id",
									value: "value",
									data: [
										{id:"10", value:"ICD-10"},
										{id:"09", value:"ICD-9"}
									]
								});
							});
						});
					});
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("code", {label:"Code", key:true})
						.setprops("diagnosis", {label:"Diagnosis"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select this plan"
				});
				
				grid.Events.OnCommand.add(function(grid, column) {
					viewParams.select(grid.dataset.get("code"));
				});

				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("status_code"));
					// row.attr("x-blacklisted", grid.dataset.get("blacklisted"));
				});	
				
				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// grid.dataset.gotoKey(id);
					// return {title: "Delete Clinic", message: ("Please confirm to delete clinic <b>{0}</b>.").format(grid.dataset.get("name"))};
				// });
				
				grid.Events.OnInitColumns.add(function(grid) {
					// grid.NewBand({id:"00", caption: "General"}, function(band) {
						grid.NewCommand({command:"select"});
						grid.NewColumn({fname: "code", width: 75, allowSort: true, fixedWidth:true});
						grid.NewColumn({fname: "diagnosis", width: 400, allowSort: true, fixedWidth:false});
						// band.NewColumn({fname: "diagnosis"});
					// })
				});
			});
		}
	});	
};