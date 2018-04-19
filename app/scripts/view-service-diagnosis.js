// ****************************************************************************************************
// File name: view-service-diagnosis.js
// Last modified on
// 
// ****************************************************************************************************
function ServiceDiagnosisView(params){
	return new JDBTreeView({
		params: params,
		// toolbarTheme:"svg",
		Painter: {
			css: "service-diagnosis"
		},
		treeViewSettings: {
			key: "id",
			parent: "parent_id",
			getLevel: function(column) {
				return column.dataset.raw("parent_id") == 0 ? 1: 2;
				// return 1;
			},
			hasChildren: function(grid) {
				return grid.dataset.raw("parent_id") == 0;
				// return true;
			},
			preInitColumn: function(column, c) {
				c.push(("<span x-sec='code'>{0}</span>").format(column.dataset.text("diagnosis_code").trim());
				// if(grid.dataset.raw("limit_id") == 0) {
					// var hasNotes = grid.dataset.text("notes") == "" ? 0 : 1;
					// var hasLimits = grid.dataset.raw("limit_count") == 0 ? 0 : 1;
					// c.push(("<span x-sec='notes' x-type='{0}'}></span>").format(hasNotes);
					// c.push(("<span x-sec='limits' x-type='{0}'}></span>").format(hasLimits);
				// } else {
					// c.push("<span x-sec='limit'}></span>");
				// };
				
				// c.push("<span x-sec='edit'}></span>");
			},
			postInitColumn: function(column, c) {
				// c.push(("<span x-sec='code'>{0}</span>").format(column.dataset.text("diagnosis_code"));
				// if(grid.dataset.text("unit_required")) {
					// c.push(("<span x-sec='unit'>{0}</span>").format(grid.dataset.text("unit_spec")));
				// };
			},
			initColumn: function(column, cell) {
				// cell.find("span[x-sec='notes'][x-type='1']")
					// .each(function(i, o) {   
						// grid.page.SetHint($(o), grid.dataset.text("notes").replace(/\r\n|\n|\r/g, '<br>'));
					// });
			}
		},
		editForm: function(id, container, dialog) {
			ServiceDiagnosisEdit({
				url: ("?id={0}").format(id),
				container: container,
				containerPadding: 0,
				showToolbar: false,
				// width: 400,
				pageControlTheme: "data-entry",
				fillContainer: true,
				dialog: dialog
			})
		},
		init: function(grid) {
			grid.Events.OnInitGrid.add(function(grid) {
				grid.optionsData.url = "service-diagnosis";
				grid.options.toolbarTheme = "svg";
				grid.options.showToolbar = true;
				grid.options.horzScroll = false;
				grid.options.showPager = false;
				grid.options.showSummary = false;
				grid.options.cardView = false;
				// grid.options.showCardToolbar = false;
				// grid.options.cardView = false;
				grid.options.autoScroll = false;
				grid.options.allowSort = false;
				// grid.options.showSelection = true;
				grid.options.showBand = false;
				grid.options.editDialogWidth = 600;
				// grid.options.showBand = true;
				// grid.options.advanceSearch = true;
				// grid.options.simpleSearch = true;
				// grid.options.simpleSearchField = "name";
				// grid.optionsData.editCallback = function(grid, id) {
					// __masterpolicy(id);
				// };

				// var parts = this.url.split("?");
				// if(parts.length > 0
					// grid.optionsData.requestParams = parts[1];
							
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
					dataParams
						// .addColumn("id", service_id, {numeric:true})
						.addColumn("id", desktop.ServiceID, {numeric:true})
						.addColumn("sort", "")
						.addColumn("order", "")
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					data.Columns
						.setprops("id", {label:"ID", numeric:true, key: true})
						.setprops("diagnosis_code", {label:"Code"})
						.setprops("diagnosis", {label:"Diagnosis"})
						// .setprops("action", {label:"Action"})
						// .setprops("due_date", {label:"Due Date", type:"date"})
						// .setprops("action_owner", {label:"Owner"})
						// .setprops("completion_date", {label:"Date Completed", type:"date", format:"datetime"})
						// .setprops("completion_user", {label:"Completed By"})
						// .setprops("create_date", {label:"Date Created", type:"date", format:"datetime"})
						// .setprops("update_date", {label:"Last Updated", type:"date", format:"datetime"})
						// .setprops("due_date", {label:"Due Date", type:"date", format:"datetime"})
				});

				grid.Events.OnCommand.add(function(grid, params) {
					// 
					if(params.command == "xdelete") {
						console.log(params);
					};
						// grid.SelectRecord(params.id, params.element)
					// else if(params.command == "edit")
						// grid.EditRecord(params.id, params.element)
					// else if(params.command == "delete")
						// grid.DeleteRecord(params.id, params.element)
					// else if(params.command == "open")
						// grid.optionsData.editCallback(grid, params.id, params.element);
					// else if(params.command == "menu")
						// grid.ShowMenu(params.id, params.element)
				});
				
				grid.Methods.add("editTitle", function(grid, mode) {
					if(mode == "edit")
						return "Edit Diagnosis"
					else if(mode == "new")
						return "Add New Diagnosis"
				});
				
				grid.Methods.add("getCommandIcon", function(grid, column) {
					if(column.command == "xdelete" && column.dataset.get("parent_id")) 
						return "db-delete"
					else if(column.command == "change-group") 
						return "ungroup"
					else if(column.command == "set-default") 
						return "set-default"
					else
						return "";
				});
	
				grid.Methods.add("getCommandHint", function(grid, column) {
					if(column.command == "edit") 
						return "Change diagnosis condition"
					else if(column.command == "delete") 
						return "Remove diagnosis"
					else if(column.command == "change-group") 
						return "Change diagnosis group"
					else if(column.command == "set-default") 
						return "Set as default diagnosis"
					else
						return "";
				});
				
				grid.Methods.add("allowCommand", function(grid, column) {
					if(column.command == "delete" || column.command == "edit" || column.command == "change-group") 
						return column.dataset.get("parent_id") > 0
					else if(column.command == "set-default") 
						// return column.dataset.get("parent_id") > 0 && !column.dataset.get("is_default")
						return column.dataset.get("parent_id") == 0 && !column.dataset.get("is_default")
					else
						return true;
				});

				grid.Events.OnInitRow.add(function(grid, row) {
					if(grid.dataset.get("is_default")) 
						row.attr("x-default", "1")
				});
				
				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewCommand({command: "change-group", float: "left"});
					grid.NewCommand({command: "set-default", float: "left"});
					grid.NewTreeViewColumn({fname: "diagnosis", width: 400, allowSort: false});
				});
				
				// grid.Events.OnInitToolbar.add(function(grid, toolbar) {
				// });
			});
		}
	});	
};
