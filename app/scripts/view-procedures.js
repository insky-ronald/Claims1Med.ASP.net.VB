// ****************************************************************************************************
// Last modified on
// 
// ****************************************************************************************************
//==================================================================================================
// File name: view-procedures.js
//==================================================================================================
function ProceduresView(viewParams){
	// var name = "app/clinics";
	
	return new jGrid($.extend(viewParams, {
		paintParams: {
			css: "procedures",
			toolbar: {theme: "svg"}
		},
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				grid.optionsData.url = "app/procedures";
				// grid.options.horzScroll = true;
				grid.options.allowSort = true;
				
				grid.search.visible = true;
				grid.search.mode = "simple";
				grid.search.columnName = "filter";
				// grid.search.mode = "advanced";
				// grid.search.searchWidth = 350;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						.addColumn("page", 1, {numeric:true})
						.addColumn("pagesize", 25, {numeric:true})
						.addColumn("sort", "code")
						.addColumn("order", "asc")
						.addColumn("filter", "")
						.addColumn("table_code", "CPT")
			
					dataParams.Columns
						.setprops("filter", {label:"Diagnosis"})
						.setprops("table_code", {label:"Table"})
						
					dataParams.Events.OnResetSearch.add(function(dataset) {
						dataset.set("table_code", "CPT");
					});
				});
				
				grid.Events.OnInitSearch.add(function(grid, editor) {
					editor.Events.OnInitEditor.add(function(sender, editor) {
						editor.NewGroupEdit({caption:"Search"}, function(editor, tab) {
							tab.container.css("border", "1px silver");
							tab.container.css("border-style", "solid solid none solid");

							editor.AddGroup("Find Procedure", function(editor) {
								editor.AddEdit("filter");
								// editor.AddRadioButton("is_shortlist", {
									// key: "id",
									// value: "value",
									// data: [
										// {id:1, value:"Yes"},
										// {id:0, value:"No"}
									// ]
								// });
								editor.AddRadioButton("table_code", {
									key: "id",
									value: "value",
									data: [
										{id:"CPT", value:"CPT"},
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
						.setprops("cpt", {label:"Procedure"})
				});
	
				grid.methods.add("getCommandIcon", function(grid, column, previous) {
					return "transfer"
				});
	
				grid.methods.add("getCommandHint", function(grid, column, previous) {
					return "Select this procedure"
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
						grid.NewColumn({fname: "cpt", width: 400, allowSort: true, fixedWidth:false});
						// band.NewColumn({fname: "diagnosis"});
					// })
				});
			});
		}
	});	
};